export function googleAuthErrorMessage(error) {
  switch (error?.code) {
    case 'auth/unauthorized-domain':
      return 'Domain website ini belum diizinkan untuk login Google. Hubungi admin ByAruna.'
    case 'auth/operation-not-allowed':
      return 'Login Google belum diaktifkan di Firebase. Hubungi admin ByAruna.'
    case 'auth/popup-blocked':
      return 'Popup Google diblokir browser. Izinkan popup untuk website ini lalu coba lagi.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Proses menghubungkan Google dibatalkan. Silakan coba lagi.'
    case 'auth/network-request-failed':
      return 'Koneksi ke Google gagal. Periksa internet lalu coba lagi.'
    default:
      return 'Gagal menghubungkan Google. Coba lagi atau lanjutkan tanpa login.'
  }
}
