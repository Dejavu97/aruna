import {
  Download,
  Upload
} from 'lucide-react'
/** PrintCardControls — sidebar kontrol kartu (diekstrak verbatim, Fase 3d). */
export default function PrintCardControls({ activeTab,
  bgOverlayOpacity,
  bgTextureUrl,
  cardType,
  copied,
  customTableListText,
  downloadQrCode,
  enclosureLayout,
  formData,
  handleImageUpload,
  photoShape,
  photoSize,
  photoUrl,
  setActiveTab,
  setBgOverlayOpacity,
  setBgTextureUrl,
  setCardType,
  setCopied,
  setCustomTableListText,
  setEnclosureLayout,
  setFormData,
  setPhotoShape,
  setPhotoSize,
  setShowPhoto,
  setTableEnd,
  setTableLayout,
  setTableMode,
  setTablePrefix,
  setTableStart,
  setThemeStyle,
  showPhoto,
  tableEnd,
  tableLayout,
  tableMode,
  tablePrefix,
  tableStart,
  themeStyle,
  uploadingImage }) {
  return (
    <>
      {/* Controls Sidebar (Hidden on Print) - 5 Cols */}        <div className="lg:col-span-5 space-y-3.5 print:hidden">
          
          {/* 1. Card Type Selection */}
          <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
            <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">1. Jenis Kartu Fisik</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ['souvenir', 'Souvenir Tag (8 per A4)'],
                ['enclosure', 'Undangan Mini (Postcard)'],
                ['table', 'Nomor Meja Batch'],
                ['bifold', 'Undangan Lipat (Bifold A4)'],
              ].map(([cVal, cLbl]) => (
                <button
                  key={cVal}
                  type="button"
                  onClick={() => setCardType(cVal)}
                  className={`py-2 px-2 text-[11px] font-semibold uppercase tracking-wider border rounded-xs transition-colors ${
                    cardType === cVal ? 'bg-ink text-ivory border-ink' : 'bg-white border-ink/15 text-stone hover:text-ink'
                  }`}
                >
                  {cLbl}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Density Options for Table & Enclosure */}
          {cardType === 'enclosure' && (
            <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">Pilihan Jumlah Kartu per Lembar A4</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setEnclosureLayout('2-per-page')}
                  className={`py-1.5 px-2 text-[10.5px] font-semibold border rounded-xs ${enclosureLayout === '2-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                >
                  2 Kartu per A4 (Besar)
                </button>
                <button
                  type="button"
                  onClick={() => setEnclosureLayout('4-per-page')}
                  className={`py-1.5 px-2 text-[10.5px] font-semibold border rounded-xs ${enclosureLayout === '4-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                >
                  4 Kartu per A4 (Kompak)
                </button>
              </div>
            </div>
          )}

          {cardType === 'table' && (
            <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">Format Nomor Meja</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => setTableLayout('2-per-page')}
                  className={`py-1.5 px-1 text-[10px] font-semibold border rounded-xs ${tableLayout === '2-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                >
                  2 per A4 (Besar)
                </button>
                <button
                  type="button"
                  onClick={() => setTableLayout('4-per-page')}
                  className={`py-1.5 px-1 text-[10px] font-semibold border rounded-xs ${tableLayout === '4-per-page' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                >
                  4 per A4 (Kompak)
                </button>
                <button
                  type="button"
                  onClick={() => setTableLayout('tent-fold')}
                  className={`py-1.5 px-1 text-[10px] font-semibold border rounded-xs ${tableLayout === 'tent-fold' ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone'}`}
                >
                  Tenda Lipat (2/A4)
                </button>
              </div>
            </div>
          )}

          {/* 2. Color Theme */}
          <div className="bg-ivory/50 p-3 border border-ink/10 rounded-xs space-y-1.5">
            <label className="block text-[10px] uppercase tracking-wider text-stone font-bold">2. Tema Warna Kartu</label>
            <div className="grid grid-cols-2 gap-1.5">
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
                  className={`py-1.5 px-2 text-left text-[10.5px] font-semibold border rounded-xs transition-colors ${
                    themeStyle === sVal ? 'bg-gold-deep text-white border-gold-deep' : 'bg-white border-ink/15 text-stone hover:text-ink'
                  }`}
                >
                  {sLbl}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Tabs for Customization */}
          <div className="flex border-b border-ink/15 text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`py-2 px-3 border-b-2 transition-colors ${activeTab === 'text' ? 'border-ink text-ink font-bold' : 'border-transparent text-stone'}`}
            >
              Edit Teks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`py-2 px-3 border-b-2 transition-colors ${activeTab === 'image' ? 'border-ink text-ink font-bold' : 'border-transparent text-stone'}`}
            >
              Foto &amp; Background
            </button>
            {cardType === 'table' && (
              <button
                type="button"
                onClick={() => setActiveTab('table')}
                className={`py-2 px-3 border-b-2 transition-colors ${activeTab === 'table' ? 'border-ink text-ink font-bold' : 'border-transparent text-stone'}`}
              >
                Daftar Nomor Meja
              </button>
            )}
          </div>

          {/* TAB: EDIT TEKS */}
          {activeTab === 'text' && (
            <div className="bg-ivory/40 p-3.5 border border-ink/10 rounded-xs space-y-3 max-h-72 overflow-y-auto text-xs">
              <div>
                <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Teks Kicker / Judul Atas</label>
                <input
                  type="text"
                  value={formData.kicker}
                  onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                  placeholder="Contoh: The Wedding Of / Wedding Souvenir"
                  className="w-full border border-ink/20 p-2 bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Nama Panggilan Pengantin Wanita</label>
                  <input
                    type="text"
                    value={formData.brideNick}
                    onChange={(e) => setFormData({ ...formData, brideNick: e.target.value })}
                    className="w-full border border-ink/20 p-2 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Nama Panggilan Pengantin Pria</label>
                  <input
                    type="text"
                    value={formData.groomNick}
                    onChange={(e) => setFormData({ ...formData, groomNick: e.target.value })}
                    className="w-full border border-ink/20 p-2 bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Tanggal Acara</label>
                <input
                  type="text"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full border border-ink/20 p-2 bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Subjudul / Pesan Ucapan</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Pesan ucapan terima kasih atau petunjuk scan QR"
                  className="w-full border border-ink/20 p-2 bg-white leading-relaxed"
                />
              </div>

              {cardType === 'bifold' && (
                <>
                  <div className="border-t border-ink/10 pt-2 space-y-2">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-ink">Rincian Akad &amp; Resepsi</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.akadVenue}
                        onChange={(e) => setFormData({ ...formData, akadVenue: e.target.value })}
                        placeholder="Lokasi Akad"
                        className="border border-ink/20 p-1.5 bg-white text-[11px]"
                      />
                      <input
                        type="text"
                        value={formData.resepsiVenue}
                        onChange={(e) => setFormData({ ...formData, resepsiVenue: e.target.value })}
                        placeholder="Lokasi Resepsi"
                        className="border border-ink/20 p-1.5 bg-white text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Kutipan / Ayat Al-Qur'an</label>
                    <textarea
                      rows={2}
                      value={formData.quote}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      className="w-full border border-ink/20 p-1.5 bg-white text-[11px]"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: FOTO & BACKGROUND */}
          {activeTab === 'image' && (
            <div className="bg-ivory/40 p-3.5 border border-ink/10 rounded-xs space-y-3.5 text-xs">
              
              {/* 1. Foto Pengantin Toggle & Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-stone font-bold">Foto Pengantin</label>
                  <button
                    type="button"
                    onClick={() => setShowPhoto(!showPhoto)}
                    className={`px-2.5 py-0.5 text-[10px] uppercase font-bold border rounded-xs ${showPhoto ? 'bg-green-700 text-white border-green-700' : 'bg-white text-stone border-ink/20'}`}
                  >
                    {showPhoto ? '✓ Ditampilkan' : 'Disembunyikan'}
                  </button>
                </div>

                {showPhoto && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      {photoUrl && (
                        <img src={photoUrl} alt="Thumb" className="w-10 h-10 object-cover rounded-xs border" />
                      )}
                      <label className="cursor-pointer border border-ink bg-ink text-ivory px-3 py-1.5 text-[10px] uppercase tracking-wider hover:bg-gold-deep transition-colors inline-flex items-center gap-1">
                        <Upload size={12} /> {uploadingImage ? 'Mengunggah...' : 'Upload Foto Sendiri'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload('photo', e)}
                        />
                      </label>
                    </div>

                    {/* Photo Shape & Size */}
                    <div className="grid grid-cols-3 gap-1 pt-1">
                      {[['circle', 'Bulat'], ['arch', 'Kubah'], ['square', 'Kotak']].map(([shVal, shLbl]) => (
                        <button
                          key={shVal}
                          type="button"
                          onClick={() => setPhotoShape(shVal)}
                          className={`py-1 text-[10px] uppercase font-semibold border rounded-xs ${photoShape === shVal ? 'bg-ink text-ivory' : 'bg-white text-stone border-ink/20'}`}
                        >
                          {shLbl}
                        </button>
                      ))}
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-stone mb-0.5">
                        <span>Ukuran Foto:</span>
                        <span className="font-mono">{photoSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="90"
                        step="5"
                        value={photoSize}
                        onChange={(e) => setPhotoSize(parseInt(e.target.value))}
                        className="w-full accent-gold-deep cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Background Texture */}
              <div className="border-t border-ink/10 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-wider text-stone font-bold">Motif Background Latar</label>
                  <label className="cursor-pointer border border-ink/20 bg-white text-ink px-2 py-1 text-[10px] uppercase tracking-wider hover:bg-ink/5 inline-flex items-center gap-1">
                    <Upload size={11} /> Upload BG
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('bg', e)}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {bgTexturePresets.map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBgTextureUrl(bg.url)}
                      className={`p-1.5 text-left border rounded-xs text-[10px] transition-colors flex items-center gap-1.5 ${bgTextureUrl === bg.url ? 'bg-gold-deep text-white border-gold-deep font-semibold' : 'bg-white text-stone border-ink/15'}`}
                    >
                      {bg.url && <img src={bg.url} alt="" className="w-4 h-4 rounded-full object-cover" />}
                      <span className="truncate">{bg.label}</span>
                    </button>
                  ))}
                </div>

                {bgTextureUrl && (
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] text-stone mb-0.5">
                      <span>Transparansi Latar (Overlay):</span>
                      <span className="font-mono">{bgOverlayOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="98"
                      step="2"
                      value={bgOverlayOpacity}
                      onChange={(e) => setBgOverlayOpacity(parseInt(e.target.value))}
                      className="w-full accent-gold-deep cursor-pointer"
                    />
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: BATCH DAFTAR NOMOR MEJA */}
          {activeTab === 'table' && cardType === 'table' && (
            <div className="bg-ivory/40 p-3.5 border border-ink/10 rounded-xs space-y-3 text-xs">
              <label className="block text-[11px] uppercase tracking-wider text-stone font-bold">Pilihan Pembuatan Nomor Meja Massal</label>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTableMode('range')}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-semibold border rounded-xs ${tableMode === 'range' ? 'bg-ink text-ivory' : 'bg-white text-stone border-ink/20'}`}
                >
                  Rentang Nomor (1 - 10)
                </button>
                <button
                  type="button"
                  onClick={() => setTableMode('custom')}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-semibold border rounded-xs ${tableMode === 'custom' ? 'bg-ink text-ivory' : 'bg-white text-stone border-ink/20'}`}
                >
                  Daftar Nama Custom
                </button>
              </div>

              {tableMode === 'range' ? (
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Awalan Teks Meja</label>
                    <input
                      type="text"
                      value={tablePrefix}
                      onChange={(e) => setTablePrefix(e.target.value)}
                      placeholder="MEJA "
                      className="w-full border border-ink/20 p-2 bg-white font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Mulai Nomor</label>
                      <input
                        type="number"
                        min="1"
                        value={tableStart}
                        onChange={(e) => setTableStart(parseInt(e.target.value) || 1)}
                        className="w-full border border-ink/20 p-2 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase text-stone mb-1 font-semibold">Sampai Nomor</label>
                      <input
                        type="number"
                        min={tableStart}
                        value={tableEnd}
                        onChange={(e) => setTableEnd(parseInt(e.target.value) || tableStart)}
                        className="w-full border border-ink/20 p-2 bg-white"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-stone">
                    Akan dicetak sebanyak <strong>{tableList.length} kartu meja</strong> ({Math.ceil(tableList.length / itemsPerSheet)} lembar A4).
                  </p>
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] uppercase text-stone font-semibold">Tulis Satu Nomor/Nama Meja per Baris:</label>
                  <textarea
                    rows={5}
                    value={customTableListText}
                    onChange={(e) => setCustomTableListText(e.target.value)}
                    placeholder="MEJA VIP 1&#10;MEJA VIP 2&#10;MEJA KELUARGA&#10;MEJA TEMAN SMA"
                    className="w-full border border-ink/20 p-2 bg-white font-mono text-xs"
                  />
                  <p className="text-[10px] text-stone">
                    Total: <strong>{tableList.length} kartu meja</strong> ({Math.ceil(tableList.length / itemsPerSheet)} lembar A4).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions Footer */}
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
    </>
  )
}

