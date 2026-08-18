export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { domain, slug, editKey } = req.body

    if (!domain || !slug || !editKey) {
      return res.status(400).json({ error: 'Domain, slug, and editKey are required' })
    }

    const firebaseUrl = `https://firestore.googleapis.com/v1/projects/aruna-1cfc9/databases/(default)/documents/invitations/${slug}`
    const fbRes = await fetch(firebaseUrl)
    const fbDoc = await fbRes.json()
    
    if (!fbRes.ok || !fbDoc.fields || fbDoc.fields.editKey?.stringValue !== editKey) {
      return res.status(403).json({ error: 'Akses ditolak: Kunci rahasia tidak valid.' })
    }

    const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID

    if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
      return res.status(500).json({ error: 'Server configuration missing' })
    }

    // Call Vercel API to remove domain
    let apiUrl = `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`
    if (VERCEL_TEAM_ID) {
      apiUrl += `?teamId=${VERCEL_TEAM_ID}`
    }

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      // Ignore error if domain is already not found on Vercel
      if (response.status !== 404) {
        throw new Error(data.error?.message || 'Failed to remove domain from Vercel')
      }
    }

    return res.status(200).json({ success: true })

  } catch (error) {
    console.error('Error removing domain:', error)
    return res.status(500).json({ error: error.message })
  }
}
