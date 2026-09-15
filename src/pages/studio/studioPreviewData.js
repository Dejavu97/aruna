import { getDummyWeddingData } from '../../data/dummyData'

// Seed dummy per eventType — dipindah verbatim dari useStudioState.jsx (Stage 10A2).
export const previewSeedByEvent = {
  wedding: 'adat-jawa',
  birthday: 'birthday-sweet17',
  graduation: 'graduation-wisuda',
  aqiqah: 'aqiqah-bayi',
  corporate: 'corporate-gala',
}

// Pure data transformation: eventType + eventConfig fields → previewData.
// Dipindah verbatim dari useMemo previewData di useStudioState.jsx (Stage 10A2);
// hook memakai thin wrapper useMemo agar lifecycle React tetap di hook.
// heroNames/quote/quoteSource diterima sebagai argumen agar module tetap pure.
export function getStudioPreviewData(eventType, heroNames, quote, quoteSource) {
  const base = getDummyWeddingData(previewSeedByEvent[eventType] || 'adat-jawa')
  const story = (base.story || []).map((s) => ({
    year: s.year || '',
    title: s.title || '',
    body: s.body || s.text || '',
  }))
  const wishes = (base.wishes || [
    { id: 'w_1', name: 'Keluarga Besar Subardjo', message: 'Selamat! Semoga menjadi keluarga yang sakinah mawaddah warahmah.' },
    { id: 'w_2', name: 'Andi & Rina', message: 'Semoga lancar sampai hari H ya.' },
  ]).map((w, i) => ({
    id: w.id || `w_${i + 1}`,
    name: w.name || 'Tamu Undangan',
    message: w.message ?? w.msg ?? '',
  }))
  return {
    ...base,
    bride: {
      nick: base.bride?.nick || heroNames,
      full: base.bride?.full || '',
      parents: base.bride?.parents || '',
      photo: base.bride?.photo || '',
      ig: base.bride?.ig || '',
    },
    groom: {
      nick: base.groom?.nick || '',
      full: base.groom?.full || '',
      parents: base.groom?.parents || '',
      photo: base.groom?.photo || '',
      ig: base.groom?.ig || '',
    },
    date: base.date || new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
    slug: base.slug || 'studio-preview',
    quote: base.quote ?? quote,
    quoteSource: base.quoteSource ?? quoteSource,
    story,
    events: base.events || [],
    gallery: (base.gallery?.length ? base.gallery : [
      '/assets/local/couple_laughing_1.jpg',
      '/assets/local/attari_cover.jpg',
      '/assets/local/couple_garden.jpg',
      '/assets/local/couple_classical.jpg',
    ]),
    wishes,
    banks: base.banks || [],
    qris: base.qris || '',
    wishlist: base.wishlist || [],
    dressColors: base.dressColors ?? '#C9A36A,#F4EFE6,#2A241C',
    dressNote: base.dressNote ?? '',
    liveUrl: base.liveUrl ?? '',
    liveDate: base.liveDate ?? base.date ?? '',
    liveTime: base.liveTime ?? '09:00',
    liveNote: base.liveNote ?? '',
    giftAddress: base.giftAddress ?? '',
  }
}
