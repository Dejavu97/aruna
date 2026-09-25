import { adminAuth, adminDb } from '../server/_firebase.js';
import { verifyPrivilegedAdmin } from '../server/_auth.js';
import { addDomainBoundary, normalizeDomain, removeDomainBoundary } from '../server/_domain-boundary.js';

const ADMIN_EMAIL = 'admin@byaruna.my.id';

function vercelConfig() {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!token || !projectId) throw Object.assign(new Error('Server configuration missing'), { status: 500 });
  return { token, projectId, teamId };
}

function projectDomainUrl({ projectId, teamId }, domain = '', version = 'v10') {
  const suffix = domain ? `/${encodeURIComponent(domain)}` : '';
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : '';
  return `https://api.vercel.com/${version}/projects/${encodeURIComponent(projectId)}/domains${suffix}${query}`;
}

async function parseJson(response) {
  return response.json().catch(() => ({}));
}

async function verifyEditKey(slug, editKey) {
  const snap = await adminDb.collection('private_keys').doc(slug).get();
  return snap.exists && snap.data()?.editKey === editKey;
}

async function loadInvitation(slug) {
  const snap = await adminDb.collection('invitations').doc(slug).get();
  return snap.exists ? snap.data() : null;
}

async function addDomain(req, body) {
  let config;
  const getConfig = () => (config ||= vercelConfig());
  return addDomainBoundary(body, {
    verifyEditKey,
    loadInvitation,
    verifyFirebaseOwner: async (invitation, idToken) => {
      try {
        const token = await adminAuth.verifyIdToken(String(idToken));
        return Boolean(token?.uid && invitation?.ownerUid && token.uid === invitation.ownerUid);
      } catch {
        return false;
      }
    },
    verifyFirebaseAdmin: async (idToken) => {
      try {
        const token = await adminAuth.verifyIdToken(String(idToken));
        return token?.email === ADMIN_EMAIL;
      } catch {
        return false;
      }
    },
    verifyAdmin: (input) => verifyPrivilegedAdmin(req, input),
    addToVercel: async (domain) => {
      const activeConfig = getConfig();
      const response = await fetch(projectDomainUrl(activeConfig), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeConfig.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: domain }),
      });
      return { ok: response.ok, status: response.status, data: await parseJson(response) };
    },
    verifyAttachedToProject: async (domain) => {
      const activeConfig = getConfig();
      const response = await fetch(projectDomainUrl(activeConfig, domain, 'v9'), {
        headers: { Authorization: `Bearer ${activeConfig.token}` },
      });
      if (!response.ok) return false;
      const data = await parseJson(response);
      return normalizeDomain(data.name) === domain;
    },
    saveDomainMapping: async (slug, domain) => {
      await adminDb.collection('invitations').doc(slug).update({
        customDomain: domain,
        updatedAt: Date.now(),
      });
    },
  });
}

async function removeDomain(req, body) {
  let config;
  const getConfig = () => (config ||= vercelConfig());
  return removeDomainBoundary(body, {
    verifyEditKey,
    loadInvitation,
    verifyFirebaseOwner: async (invitation, idToken) => {
      try {
        const token = await adminAuth.verifyIdToken(String(idToken));
        return Boolean(token?.uid && invitation?.ownerUid && token.uid === invitation.ownerUid);
      } catch {
        return false;
      }
    },
    verifyFirebaseAdmin: async (idToken) => {
      try {
        const token = await adminAuth.verifyIdToken(String(idToken));
        return token?.email === ADMIN_EMAIL;
      } catch {
        return false;
      }
    },
    verifyAdmin: (input) => verifyPrivilegedAdmin(req, input),
    removeFromVercel: async (domain) => {
      const activeConfig = getConfig();
      const response = await fetch(projectDomainUrl(activeConfig, domain, 'v9'), {
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
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const action = Array.isArray(req.query?.action) ? req.query.action[0] : req.query?.action;
  const body = req.body || null;
  if (action !== 'add' && action !== 'remove') {
    return res.status(404).json({ error: 'Domain action not found' });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Body JSON tidak valid.' });
  }
  if (!body.domain || !body.slug || (!body.editKey && !body.idToken && !body.adminKey)) {
    return res.status(400).json({ error: 'Domain, slug, and authorization are required' });
  }

  try {
    const result = action === 'add' ? await addDomain(req, body) : await removeDomain(req, body);
    return res.status(200).json(result);
  } catch (error) {
    const status = Number(error.status) || 500;
    if (status >= 500) console.error(`Error ${action === 'add' ? 'adding' : 'removing'} domain:`, error);
    return res.status(status).json({
      error: error.message || `Gagal ${action === 'add' ? 'menambahkan' : 'menghapus'} domain.`,
    });
  }
}
