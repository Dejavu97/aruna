import { adminDb } from './_firebase.js';

export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { domain, slug, editKey } = req.body

    if (!domain || !slug || !editKey) {
      return res.status(400).json({ error: 'Domain, slug, and editKey are required' })
    }

    // Validasi editKey ke Firebase (Mencegah spam API oleh hacker)
    const secretRef = adminDb.collection('private_keys').doc(slug)
    const secretSnap = await secretRef.get()
    
    if (!secretSnap.exists || secretSnap.data().editKey !== editKey) {
      return res.status(403).json({ error: 'Akses ditolak: Kunci rahasia (editKey) tidak valid atau undangan tidak ditemukan.' })
    }

    // Mengambil informasi rahasia dari environment variables Vercel
    const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID // Optional, jika project ada di bawah team

    if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
      return res.status(500).json({ error: 'Server configuration missing' })
    }

    // Memanggil API Vercel untuk menambahkan domain ke project
    let apiUrl = `https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/domains`
    if (VERCEL_TEAM_ID) {
      apiUrl += `?teamId=${VERCEL_TEAM_ID}`
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to add domain to Vercel')
    }

    // Jika berhasil
    return res.status(200).json({ success: true, domain: data.name })

  } catch (error) {
    console.error('Error adding domain:', error)
    return res.status(500).json({ error: error.message })
  }
}
