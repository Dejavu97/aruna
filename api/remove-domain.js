import { adminDb } from './_firebase.js';
import { normalizeDomain, removeDomainBoundary } from './_domain-boundary.js';

function vercelConfig() {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!token || !projectId) throw Object.assign(new Error('Server configuration missing'), { status: 500 });
  return { token, projectId, teamId };
}

function projectDomainUrl({ projectId, teamId }, domain) {
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  return `https://api.vercel.com/v9/projects/${encodeURIComponent(projectId)}/domains/${encodeURIComponent(domain)}${query}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || null;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ error: 'Body JSON tidak valid.' });
    }
    if (!body.domain || !body.slug || !body.editKey) {
      return res.status(400).json({ error: 'Domain, slug, and editKey are required' });
    }
    let config;
    const getConfig = () => (config ||= vercelConfig());

    const result = await removeDomainBoundary(body, {
      verifyEditKey: async (slug, editKey) => {
        const snap = await adminDb.collection('private_keys').doc(slug).get();
        return snap.exists && snap.data()?.editKey === editKey;
      },
      loadInvitation: async (slug) => {
        const snap = await adminDb.collection('invitations').doc(slug).get();
        return snap.exists ? snap.data() : null;
      },
      removeFromVercel: async (domain) => {
        const activeConfig = getConfig();
        const response = await fetch(projectDomainUrl(activeConfig, domain), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${activeConfig.token}` },
        });
        return {
          ok: response.ok,
          status: response.status,
          data: await response.json().catch(() => ({})),
        };
      },
      clearDomainMapping: async (slug, verifiedDomain) => {
        const invitationRef = adminDb.collection('invitations').doc(slug);
        await adminDb.runTransaction(async (transaction) => {
          const snap = await transaction.get(invitationRef);
          if (!snap.exists || normalizeDomain(snap.data()?.customDomain) !== verifiedDomain) {
            throw Object.assign(new Error('Domain undangan berubah. Muat ulang dan coba lagi.'), { status: 409 });
          }
          transaction.update(invitationRef, { customDomain: null, updatedAt: Date.now() });
        });
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    const status = Number(error.status) || 500;
    if (status >= 500) console.error('Error removing domain:', error);
    return res.status(status).json({ error: error.message || 'Gagal menghapus domain.' });
  }
}
