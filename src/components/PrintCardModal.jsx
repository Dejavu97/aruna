import { useState } from 'react'
import { Printer, Download, QrCode, Sparkles, Check, Copy, Sliders, Layers } from 'lucide-react'
import { formatLongDate, invitationUrl, copyText } from '../lib/utils'

export default function PrintCardModal({ item, onClose }) {
  const [cardType, setCardType] = useState('souvenir') // 'souvenir' | 'enclosure' | 'table'
  const [themeStyle, setThemeStyle] = useState('gold-ivory') // 'gold-ivory' | 'monochrome' | 'sage-green' | 'royal-navy'
  const [customTitle, setCustomTitle] = useState('')
  const [customSubtitle, setCustomSubtitle] = useState('')
  const [tableNumber, setTableNumber] = useState('MEJA 01')
  const [sheetLayout, setSheetLayout] = useState('grid') // 'single' | 'grid'
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const brideNick = item.bride?.nick || 'Bride'
  const groomNick = item.groom?.nick || 'Groom'
  const couple = `${brideNick} & ${groomNick}`
  const dateFormatted = formatLongDate(item.date)
  const fullUrl = invitationUrl(item.slug)

  // QR Code Image High-Res
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(fullUrl)}&margin=10&format=png`

  // Default Texts based on Card Type
  const title = customTitle || (
    cardType === 'souvenir'
      ? 'Thank You'
      : cardType === 'enclosure'
      ? 'The Wedding Of'
      : tableNumber
  )

  const subtitle = customSubtitle || (
    cardType === 'souvenir'
      ? 'for celebrating our special day with us'
      : cardType === 'enclosure'
      ? 'Pindai QR Code untuk melihat undangan digital & konfirmasi kehadiran'
      : 'Selamat Menikmati Jamuan'
  )

  // Style Classes
  const getStyleClasses = () => {
    switch (themeStyle) {
      case 'monochrome':
        return {
          cardBg: 'bg-white text-black border-black/80',
          accent: 'text-black',
          border: 'border-black/30',
          badge: 'bg-black text-white',
          ornament: 'border-black',
        }
      case 'sage-green':
        return {
          cardBg: 'bg-[#F4F7F4] text-[#2D3B2D] border-[#8FA88F]',
          accent: 'text-[#557555]',
          border: 'border-[#8FA88F]/40',
          badge: 'bg-[#557555] text-white',
          ornament: 'border-[#557555]',
        }
      case 'royal-navy':
        return {
          cardBg: 'bg-[#0F172A] text-[#F8FAFC] border-[#C5A059]',
          accent: 'text-[#E2C275]',
          border: 'border-[#C5A059]/40',
          badge: 'bg-[#C5A059] text-[#0F172A]',
          ornament: 'border-[#C5A059]',
        }
      case 'gold-ivory':
      default:
        return {
          cardBg: 'bg-[#FAF8F5] text-[#2C241D] border-[#C5A059]/60',
          accent: 'text-[#96742E]',
          border: 'border-[#C5A059]/30',
          badge: 'bg-[#96742E] text-white',
          ornament: 'border-[#C5A059]',
        }
    }
  }

  const styles = getStyleClasses()

  // Download High-Res QR Code PNG
  async function downloadQrCode() {
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `QR_Aruna_${item.slug}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      window.open(qrCodeUrl, '_blank')
    }
  }

  // Single Card Content Renderer
  const renderSingleCard = (idx = 1) => {
    if (cardType === 'souvenir') {
      return (
        <div
          key={idx}
          className={`relative p-5 rounded-xs border-2 flex flex-col items-center justify-between text-center transition-all ${styles.cardBg} ${styles.border} w-[240px] h-[340px] mx-auto shadow-xs print:shadow-none print:m-0`}
        >
          {/* Top Decorative Border */}
          <div className="w-full space-y-1">
            <p className="text-[9px] uppercase tracking-[0.25em] font-semibold text-stone">Wedding Souvenir</p>
            <h4 className="font-display text-2xl font-bold italic tracking-wide">{title}</h4>
            <div className="w-8 h-[1px] bg-current opacity-30 mx-auto my-1" />
            <p className="text-[10px] text-stone leading-tight italic px-2">{subtitle}</p>
          </div>

          {/* QR Code Center */}
          <div className="p-2 bg-white rounded-xs border border-black/10 shadow-xs">
            <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 object-contain" />
          </div>

          {/* Bottom Couple & Date */}
          <div className="w-full pt-1 border-t border-current/15">
            <p className="font-display text-lg font-bold tracking-tight">{couple}</p>
            <p className="text-[9px] uppercase tracking-widest font-semibold opacity-75">{dateFormatted}</p>
          </div>
        </div>
      )
    }

    if (cardType === 'enclosure') {
      return (
        <div
          key={idx}
          className={`relative p-7 rounded-xs border-2 flex flex-col items-center justify-between text-center transition-all ${styles.cardBg} ${styles.border} w-[300px] h-[440px] mx-auto shadow-xs print:shadow-none print:m-0`}
        >
          {/* Top Header */}
          <div className="space-y-1.5 w-full">
            <div className="w-10 h-10 mx-auto rounded-full border border-current/30 flex items-center justify-center font-display text-base font-bold italic mb-1">
              {brideNick[0]}&amp;{groomNick[0]}
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone">{title}</p>
            <h3 className="font-display text-2xl font-bold tracking-tight">{couple}</h3>
            <p className="text-[11px] font-semibold opacity-85">{dateFormatted}</p>
          </div>

          {/* Center QR & Instructions */}
          <div className="space-y-2 flex flex-col items-center">
            <div className="p-2.5 bg-white rounded-xs border border-black/10 shadow-xs">
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 object-contain" />
            </div>
            <p className="text-[10px] leading-relaxed max-w-[200px] opacity-80">{subtitle}</p>
          </div>

          {/* Footer URL */}
          <div className="w-full pt-2 border-t border-current/15 text-[9px] font-mono opacity-70 break-all">
            {fullUrl}
          </div>
        </div>
      )
    }

    // Table Tent Card
    return (
      <div
        key={idx}
        className={`relative p-6 rounded-xs border-2 flex flex-col items-center justify-between text-center transition-all ${styles.cardBg} ${styles.border} w-[300px] h-[400px] mx-auto shadow-xs print:shadow-none print:m-0`}
      >
        <div className="space-y-1 w-full">
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-stone">The Wedding Of {couple}</p>
          <div className="w-12 h-[1px] bg-current opacity-30 mx-auto my-2" />
        </div>

        {/* Big Table Number */}
        <div className="space-y-1 my-2">
          <h2 className="font-display text-4xl font-black uppercase tracking-wider">{title}</h2>
          <p className="text-xs italic opacity-85">{subtitle}</p>
        </div>

        {/* QR Code for live access */}
        <div className="space-y-1.5 flex flex-col items-center">
          <div className="p-2 bg-white rounded-xs border border-black/10 shadow-xs">
            <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 object-contain" />
          </div>
          <p className="text-[9px] uppercase tracking-wider opacity-75 font-semibold">Scan untuk Foto &amp; Ucapan Live</p>
        </div>

        <p className="text-[9px] font-semibold opacity-60 uppercase tracking-widest">{dateFormatted}</p>
      </div>
    )
  }

  // Calculate number of cards in sheet grid
  const gridCount = cardType === 'souvenir' ? 8 : cardType === 'enclosure' ? 2 : 2

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-paper border border-ink/20 max-w-5xl w-full p-6 sm:p-8 rounded-sm shadow-2xl space-y-6 my-auto max-h-[95vh] flex flex-col print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none">
        
        {/* Top Header (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-ink/10 pb-4 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gold-deep/10 text-gold-deep flex items-center justify-center border border-gold-deep/20">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Generator Kartu Fisik &amp; Souvenir QR</h3>
              <p className="text-xs text-stone">
                Cetak kartu ucapan terima kasih, mini invitation, atau nomor meja siap potong.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-wider font-bold hover:bg-gold-deep transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Printer size={14} /> Cetak Lembar A4 (Print / PDF)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-stone hover:text-ink text-xs font-bold px-2.5 py-1.5 border border-ink/15 hover:bg-ink/5"
            >
              ✕ Tutup
            </button>
          </div>
        </div>

        {/* Main Content Area (Controls + Preview) */}
        <div className="grid lg:grid-cols-12 gap-6 flex-1 overflow-y-auto pr-1 print:block">
          
          {/* Controls Sidebar (Hidden on Print) - 5 Cols */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            
            {/* 1. Card Type Selection */}
            <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">1. Jenis Kartu Fisik</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['souvenir', 'Kartu Souvenir'],
                  ['enclosure', 'Undangan Mini'],
                  ['table', 'Nomor Meja'],
                ].map(([cVal, cLbl]) => (
                  <button
                    key={cVal}
                    type="button"
                    onClick={() => {
                      setCardType(cVal)
                      setCustomTitle('')
                      setCustomSubtitle('')
                    }}
                    className={`py-2 px-2 text-[11px] font-semibold uppercase tracking-wider border rounded-xs transition-colors ${
                      cardType === cVal ? 'bg-ink text-ivory border-ink' : 'bg-white border-ink/15 text-stone hover:text-ink'
                    }`}
                  >
                    {cLbl}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Color Theme Style */}
            <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-2">
              <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">2. Tema Warna Kartu</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['gold-ivory', 'Gold Ivory (Mewah)'],
                  ['monochrome', 'Monochrome (Hitam Putih)'],
                  ['sage-green', 'Sage Green (Botanical)'],
                  ['royal-navy', 'Royal Navy & Gold'],
                ].map(([sVal, sLbl]) => (
                  <button
                    key={sVal}
                    type="button"
                    onClick={() => setThemeStyle(sVal)}
                    className={`py-2 px-2.5 text-left text-[11px] font-semibold border rounded-xs transition-colors ${
                      themeStyle === sVal ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone hover:text-ink'
                    }`}
                  >
                    {sLbl}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Text Customizer */}
            <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-3">
              <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">3. Kustomisasi Teks</label>
              
              {cardType === 'table' ? (
                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Nomor / Nama Meja</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Contoh: MEJA 01, MEJA VIP"
                    className="w-full border border-ink/20 p-2 text-xs bg-white font-bold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Judul Kartu</label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder={cardType === 'souvenir' ? 'Thank You' : 'The Wedding Of'}
                    className="w-full border border-ink/20 p-2 text-xs bg-white font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Pesan / Keterangan</label>
                <input
                  type="text"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder={cardType === 'souvenir' ? 'for celebrating our special day' : 'Pindai QR Code untuk melihat undangan'}
                  className="w-full border border-ink/20 p-2 text-xs bg-white"
                />
              </div>
            </div>

            {/* 4. Sheet Layout Option & QR Download */}
            <div className="bg-ivory/50 p-4 border border-ink/10 rounded-xs space-y-3">
              <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">4. Layout Cetak A4</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSheetLayout('grid')}
                  className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold border rounded-xs ${
                    sheetLayout === 'grid' ? 'bg-ink text-ivory border-ink' : 'bg-white border-ink/15 text-stone'
                  }`}
                >
                  Lembar A4 ({gridCount} Kartu)
                </button>
                <button
                  type="button"
                  onClick={() => setSheetLayout('single')}
                  className={`flex-1 py-2 text-xs uppercase tracking-wider font-semibold border rounded-xs ${
                    sheetLayout === 'single' ? 'bg-ink text-ivory border-ink' : 'bg-white border-ink/15 text-stone'
                  }`}
                >
                  1 Kartu Saja
                </button>
              </div>

              <div className="pt-2 border-t border-ink/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={downloadQrCode}
                  className="text-xs text-gold-deep hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <Download size={13} /> Download QR PNG HD
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (await copyText(fullUrl)) {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 1500)
                    }
                  }}
                  className="text-xs text-stone hover:text-ink underline"
                >
                  {copied ? '✓ Tautan Tersalin' : 'Salin Tautan Undangan'}
                </button>
              </div>
            </div>

          </div>

          {/* Preview & Print Sheet Area - 7 Cols */}
          <div className="lg:col-span-7 bg-black/5 p-4 sm:p-6 rounded-sm border border-ink/10 flex flex-col items-center justify-center overflow-x-auto print:bg-white print:p-0 print:border-none print:w-full">
            
            {/* Sheet Container */}
            <div className="bg-white p-6 rounded-xs shadow-md border border-black/10 min-w-[320px] max-w-[620px] w-full print:shadow-none print:border-none print:p-0 print:max-w-none print:w-full">
              
              <div className="mb-4 text-center border-b border-dashed pb-2 print:hidden">
                <p className="text-[10px] uppercase tracking-widest text-stone font-semibold">
                  Preview Lembar Cetak ({sheetLayout === 'grid' ? `${gridCount} Kartu per A4` : 'Single Card'})
                </p>
              </div>

              {/* Grid or Single Render */}
              {sheetLayout === 'grid' ? (
                <div
                  className={`grid gap-3 print:gap-4 ${
                    cardType === 'souvenir'
                      ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 print:grid-cols-2'
                      : 'grid-cols-1 sm:grid-cols-2 print:grid-cols-2'
                  }`}
                >
                  {Array.from({ length: gridCount }).map((_, idx) => renderSingleCard(idx + 1))}
                </div>
              ) : (
                <div className="flex justify-center">{renderSingleCard(1)}</div>
              )}

              {/* Cutting Guide Footer on Print */}
              <div className="hidden print:block pt-4 text-center text-[8px] text-stone uppercase tracking-widest border-t border-dashed mt-4">
                Potong mengikuti garis tepi kartu · Aruna Digital Wedding Invitation
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
