import { getTheme } from '../data/themes'
import { invitePath } from '../lib/nav'
import { formatLongDate, isEventEditLocked } from '../lib/utils'
import { rememberEditKey } from '../lib/api'
import { Link } from 'react-router-dom'
import SiteNav from '../components/SiteNav'
import SiteFooter from '../components/SiteFooter'
import { useManageState } from './manage/useManageState'
import ManageLoveQr from './manage/ManageLoveQr'
import ManageRingkas from './manage/ManageRingkas'
import ManageRsvp from './manage/ManageRsvp'
import ManageCheckIn from './manage/ManageCheckIn'
import ManageUcapan from './manage/ManageUcapan'
import ManageDomain from './manage/ManageDomain'
import ManageTamu from './manage/ManageTamu'

/**
 * Manage — thin orchestrator (Fase 3c). State/logic verbatim di
 * ./manage/useManageState; tab regions verbatim di ./manage/Manage*.jsx.
 * Perilaku & UI identik.
 */
export default function Manage() {
  const { checkedInCount,
  error,
  globalAnnouncement,
  item,
  loading,
  reload,
  setShowPrintCardModal,
  setTab,
  stats,
  tab,
  text,
  editKey,
  isAdmin,
  slug } = useManageState()

  if (loading && !item && !error) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-gold-deep border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-display text-xl">Memuat Dashboard...</p>
          <p className="text-xs text-stone">Menyiapkan data undangan &amp; daftar tamu</p>
        </div>
      </div>
    )
  }

  if (!editKey && !isAdmin) {
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory px-5 text-center">
        <div className="max-w-md w-full p-6 sm:p-8 bg-paper border border-ink/15 rounded-sm space-y-4 shadow-sm">
          <p className="font-display text-2xl font-bold">Akses Dashboard Pelanggan</p>
          <p className="text-xs text-stone leading-relaxed">
            Untuk mengelola undangan <strong>{slug}</strong>, silakan masukkan kode edit rahasia Anda atau buka tautan lengkap dari WhatsApp konfirmasi pesanan:
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const val = e.target.keyVal.value.trim()
              if (val) {
                rememberEditKey(slug, val)
                window.location.href = `/kelola/${slug}?key=${encodeURIComponent(val)}`
              }
            }}
            className="flex gap-2 pt-1"
          >
            <input
              name="keyVal"
              type="text"
              placeholder="Masukkan kode edit"
              required
              className="flex-1 border border-ink/20 p-2.5 text-xs bg-white font-mono"
            />
            <button
              type="submit"
              className="bg-ink text-ivory px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold-deep transition-colors"
            >
              Masuk
            </button>
          </form>
          <div className="pt-2 border-t border-ink/10">
            <Link to="/" className="text-xs text-stone hover:text-ink underline">
              ← Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (error && !item) {
    return (
      <div className="bg-ivory">
        <SiteNav />
        <section className="mx-auto max-w-lg px-5 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Dashboard</p>
          <h1 className="mt-2 font-display text-4xl">Undangan tidak ditemukan</h1>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            Data <strong>{slug}</strong> tidak ada di server. Buat undangan baru dari katalog.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.16em]">
            <Link to="/tema" className="bg-ink px-4 py-3 text-ivory">
              Buat undangan baru
            </Link>
            <Link to={isAdmin ? '/admin' : '/'} className="border border-ink px-4 py-3">
              ← Kembali
            </Link>
          </div>
        </section>
        <SiteFooter />
      </div>
    )
  }

  const theme = item ? getTheme(item.themeId) : null
  const couple = item ? `${item.bride?.nick || ''} & ${item.groom?.nick || ''}` : slug

  return (
    <div className="bg-ivory">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-5 py-10 md:py-14">
        {globalAnnouncement && (
          <div className="mb-8 border border-gold bg-gold/10 px-6 py-4 rounded-md shadow-sm">
            <h3 className="text-xs uppercase tracking-widest text-gold-deep mb-1 font-bold inline-flex items-center gap-1.5">
              <Megaphone size={14} /> Pengumuman
            </h3>
            <p className="text-sm text-ink font-medium leading-relaxed">{globalAnnouncement}</p>
          </div>
        )}

        <Link to={backHref} className="inline-flex text-sm text-stone hover:text-ink">
          {backLabel}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">
                {isAdmin ? 'Admin · Dashboard undangan' : 'Dashboard pelanggan'}
              </p>
              {isEventEditLocked(item?.date, 1) && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs inline-flex items-center gap-1">
                  <Lock size={10} /> Arsip Kenangan (H+1)
                </span>
              )}
            </div>
            <h1 className="mt-2 font-display text-4xl md:text-5xl">{couple}</h1>
            <p className="mt-2 text-sm text-stone">
              {item?.date ? formatLongDate(item.date) : ''}
              {theme ? ` · ${theme.name}` : ''}
              {item?.status === 'paid' ? ' · Lunas' : ' · Menunggu pelunasan'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.14em]">
            <Link to={`/u/${slug}`} className="bg-ink px-3 py-2 text-ivory hover:bg-gold-deep transition-colors">
              Buka undangan
            </Link>
            {!isAdmin && isEventEditLocked(item?.date, 1) ? (
              <span
                className="border border-ink/20 bg-ink/5 px-3 py-2 text-stone opacity-60 cursor-not-allowed inline-flex items-center gap-1 font-medium"
                title="Masa edit telah berakhir (H+1 pasca hari acara)"
              >
                <Lock size={11} /> Edit Terkunci
              </span>
            ) : (
              <Link
                to={invitePath(`/edit/${slug}`, { key: editKey, from: isAdmin ? 'admin' : 'customer' })}
                className="border border-ink/20 px-3 py-2 hover:border-gold-deep transition-colors"
              >
                Edit data
              </Link>
            )}
            <button
              type="button"
              onClick={() => setShowPrintCardModal(true)}
              className="border border-gold-deep/30 bg-gold-deep/10 text-gold-deep px-3 py-2 font-semibold inline-flex items-center gap-1 hover:bg-gold-deep hover:text-white transition-colors"
            >
              <QrCode size={13} /> Kartu Souvenir &amp; QR
            </button>
            <button type="button" onClick={reload} className="border border-ink/20 px-3 py-2 hover:bg-ink/5 transition-colors">
              Segarkan
            </button>
          </div>
        </div>

        {/* H+1 Grace Period Banner */}
        {!isAdmin && isEventEditLocked(item?.date, 1) && (
          <div className="mt-6 border border-amber-300 bg-amber-50/90 p-4 rounded-sm flex items-start gap-3 text-amber-950 shadow-xs">
            <Shield size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Lock size={12} /> Masa Edit Telah Berakhir (H+1 Pasca Acara)
              </p>
              <p className="text-stone leading-relaxed">
                Acara pada tanggal <strong>{formatLongDate(item?.date)}</strong> telah sukses terselenggara. Fitur revisi data mandiri kini terkunci otomatis. Seluruh galeri kenangan, tautan undangan, dan buku tamu Anda tetap aktif dan tersimpan abadi seumur hidup.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="RSVP" value={stats.total} />
          <Stat label="Hadir" value={stats.hadir} />
          <Stat label="Jumlah orang" value={stats.heads} />
          <Stat label="Tidak hadir" value={stats.tidak} />
          <Stat label="Belum pasti" value={stats.ragu} />
          <Stat label="Ucapan" value={stats.wishes} />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-b border-ink/10 pb-0 text-xs uppercase tracking-[0.14em]">
          {[
            ['ringkas', 'Ringkas'],
            ['love_qr', 'Kartu QR Cinta & Kado'],
            ['rsvp', 'RSVP'],
            ['checkin', `Buku Tamu (${checkedInCount})`],
            ['ucapan', 'Ucapan'],
            ['tamu', 'Daftar tamu'],
            ['domain', 'Domain Pribadi'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`shrink-0 border-b-2 px-3 py-2 transition-colors ${
                tab === id ? 'border-gold text-ink font-bold bg-gold/5' : 'border-transparent text-stone hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'love_qr' && (
            <ManageLoveQr
            item={item}
            />
          )}
          {tab === 'ringkas' && (
            <ManageRingkas
            copied={copied}
            customWatermarkText={customWatermarkText}
            customWatermarkUrl={customWatermarkUrl}
            guests={guests}
            handleSaveWatermark={handleSaveWatermark}
            item={item}
            savingWatermark={savingWatermark}
            setCopied={setCopied}
            setCustomWatermarkText={setCustomWatermarkText}
            setCustomWatermarkUrl={setCustomWatermarkUrl}
            setItem={setItem}
            setShowStoryModal={setShowStoryModal}
            setWatermarkMode={setWatermarkMode}
            stats={stats}
            tab={tab}
            text={text}
            watermarkMode={watermarkMode}
            />
          )}
          {tab === 'rsvp' && (
            <ManageRsvp
            guests={guests}
            item={item}
            text={text}
            />
          )}
          {tab === 'checkin' && (
            <ManageCheckIn
            checkInFilter={checkInFilter}
            checkInSearch={checkInSearch}
            checkedInCount={checkedInCount}
            exportCheckInCSV={exportCheckInCSV}
            filteredCheckInGuests={filteredCheckInGuests}
            guests={guests}
            guestsWithCheckIn={guestsWithCheckIn}
            parsedGuests={parsedGuests}
            recentCheckIn={recentCheckIn}
            setCheckInFilter={setCheckInFilter}
            setCheckInSearch={setCheckInSearch}
            setShowScanner={setShowScanner}
            text={text}
            toggleCheckIn={toggleCheckIn}
            totalCheckedInPax={totalCheckedInPax}
            />
          )}
          {tab === 'ucapan' && (
            <ManageUcapan
            handleReply={handleReply}
            item={item}
            replyText={replyText}
            replying={replying}
            replyingTo={replyingTo}
            setReplyText={setReplyText}
            setReplyingTo={setReplyingTo}
            text={text}
            />
          )}
          {tab === 'domain' && (
            <ManageDomain
            customDomain={customDomain}
            error={error}
            item={item}
            setCustomDomain={setCustomDomain}
            setError={setError}
            setItem={setItem}
            text={text}
            />
          )}
          {tab === 'tamu' && (
            <ManageTamu
            composeMessage={composeMessage}
            copied={copied}
            copiedMsg={copiedMsg}
            copyAllMessages={copyAllMessages}
            error={error}
            exportGuestsCSV={exportGuestsCSV}
            filteredGuests={filteredGuests}
            guestSearch={guestSearch}
            guests={guests}
            guestsWithRsvp={guestsWithRsvp}
            hadirCount={hadirCount}
            handleFileUpload={handleFileUpload}
            importInfo={importInfo}
            messageMode={messageMode}
            parsedGuests={parsedGuests}
            removeGuest={removeGuest}
            save={save}
            saved={saved}
            setCopied={setCopied}
            setCopiedMsg={setCopiedMsg}
            setGuestSearch={setGuestSearch}
            setMessageMode={setMessageMode}
            setStatusFilter={setStatusFilter}
            setText={setText}
            setWaReminderTemplate={setWaReminderTemplate}
            setWaTemplate={setWaTemplate}
            statusFilter={statusFilter}
            text={text}
            tidakCount={tidakCount}
            unconfirmedCount={unconfirmedCount}
            waReminderTemplate={waReminderTemplate}
            waTemplate={waTemplate}
            />
          )}
        </div>
      </section>

      {showScanner && (
        <QrCameraScanner
          onScan={handleQrScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showStoryModal && item && (
        <WeddingFrameModal
          data={item}
          couple={`${item.bride?.nick || ''} & ${item.groom?.nick || ''}`}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {showPrintCardModal && item && (
        <PrintCardModal
          item={item}
          onClose={() => setShowPrintCardModal(false)}
        />
      )}

      <SiteFooter />
    </div>
  )
}
