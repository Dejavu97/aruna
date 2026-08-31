import {
  Bell,
  Copy,
  Download,
  Search,
  Send,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react'
import { copyText } from '../../lib/utils'
import Stat from './Stat'

/** ManageTamu — diekstrak verbatim dari Manage.jsx (Fase 3c, perilaku identik). */
export default function ManageTamu({ composeMessage,
  copied,
  copiedMsg,
  copyAllMessages,
  error,
  exportGuestsCSV,
  filteredGuests,
  guestSearch,
  guests,
  guestsWithRsvp,
  hadirCount,
  handleFileUpload,
  importInfo,
  messageMode,
  parsedGuests,
  removeGuest,
  save,
  saved,
  setCopied,
  setCopiedMsg,
  setGuestSearch,
  setMessageMode,
  setStatusFilter,
  setText,
  setWaReminderTemplate,
  setWaTemplate,
  statusFilter,
  text,
  tidakCount,
  unconfirmedCount,
  waReminderTemplate,
  waTemplate  }) {
  return (

          <div className="grid gap-8">
            {/* Header & Upload Bar */}
            <div className="border border-ink/10 bg-paper p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gold-deep">Manajemen Tamu &amp; WhatsApp</p>
                  <h2 className="mt-1 font-display text-2xl">Daftar Tamu, RSVP &amp; Pengingat</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 border border-ink bg-ink px-4 py-2.5 text-xs uppercase tracking-widest text-ivory hover:bg-gold-deep transition-colors">
                    <Upload size={14} /> Import File (CSV / TXT)
                    <input
                      type="file"
                      accept=".csv,.txt,.tsv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {parsedGuests.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={exportGuestsCSV}
                        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-ink/5"
                      >
                        <Download size={14} /> Download Excel (CSV)
                      </button>
                      <button
                        type="button"
                        onClick={copyAllMessages}
                        className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-ink/5"
                      >
                        <Copy size={14} /> {copied === 'all' ? 'Semua Tersalin!' : messageMode === 'reminder' ? 'Salin Semua Reminder' : 'Salin Semua Pesan'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {importInfo && (
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-green-700">
                  ✓ {importInfo}
                </p>
              )}

              {/* Input Manual & Template Selector */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone mb-2">
                    Input Manual (Nama atau Nama, No WhatsApp)
                  </label>
                  <textarea
                    className="min-h-40 w-full border border-ink/20 bg-transparent p-3 text-sm focus:border-ink focus:outline-none"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={'Bapak Budi & Istri\nKeluarga Besar Wijaya, 08123456789\nAndi (Teman Kantor), 08571234567'}
                  />
                  <p className="mt-1 text-[11px] text-stone">
                    Format per baris: <code className="bg-ink/5 px-1 py-0.5">Nama</code> atau <code className="bg-ink/5 px-1 py-0.5">Nama, 0812xxxxxx</code> (Bisa langsung copy-paste dari Excel).
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-widest text-stone">
                      Mode Template Pesan
                    </label>
                    <div className="flex gap-1 bg-ivory border border-ink/10 p-0.5">
                      <button
                        type="button"
                        onClick={() => setMessageMode('invitation')}
                        className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors ${
                          messageMode === 'invitation' ? 'bg-ink text-ivory' : 'text-stone hover:text-ink'
                        }`}
                      >
                        Undangan Awal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMessageMode('reminder')
                          setStatusFilter('unconfirmed')
                        }}
                        className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium transition-colors inline-flex items-center gap-1 ${
                          messageMode === 'reminder' ? 'bg-gold-deep text-ivory' : 'text-stone hover:text-ink'
                        }`}
                      >
                        <Bell size={11} /> Pengingat RSVP
                      </button>
                    </div>
                  </div>

                  {messageMode === 'invitation' ? (
                    <div>
                      <textarea
                        className="min-h-40 w-full border border-ink/20 bg-transparent p-3 text-sm focus:border-ink focus:outline-none"
                        value={waTemplate}
                        onChange={(e) => setWaTemplate(e.target.value)}
                      />
                      <p className="mt-1 text-[11px] text-stone">
                        Gunakan <code className="bg-ink/5 px-1 py-0.5">[nama]</code> untuk nama tamu &amp; <code className="bg-ink/5 px-1 py-0.5">[link]</code> untuk tautan undangan.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        className="min-h-40 w-full border border-gold-deep/40 bg-gold-deep/5 p-3 text-sm focus:border-gold-deep focus:outline-none"
                        value={waReminderTemplate}
                        onChange={(e) => setWaReminderTemplate(e.target.value)}
                      />
                      <p className="mt-1 text-[11px] text-stone">
                        Gunakan <code className="bg-ink/5 px-1 py-0.5">[nama]</code>, <code className="bg-ink/5 px-1 py-0.5">[tanggal]</code>, &amp; <code className="bg-ink/5 px-1 py-0.5">[link]</code> untuk link undangan.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between border-t border-ink/10 pt-4 gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={save}
                    className="bg-ink px-6 py-3 text-xs uppercase tracking-[0.16em] text-ivory hover:bg-gold-deep transition-colors"
                  >
                    Simpan Perubahan
                  </button>
                  {saved && !error && <span className="text-xs uppercase tracking-[0.1em] text-green-700 font-medium">✓ Tersimpan di database</span>}
                  {error && <span className="text-xs text-red-700">{error}</span>}
                </div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-stone">
                  <span>Total: <strong>{parsedGuests.length} Tamu</strong></span>
                  <span>·</span>
                  <span className="text-amber-800 font-medium">Belum RSVP: <strong>{unconfirmedCount}</strong></span>
                </div>
              </div>
            </div>

            {/* Guest Search & Filter Tabs */}
            {parsedGuests.length > 0 && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      ['all', `Semua (${guestsWithRsvp.length})`],
                      ['unconfirmed', `⏳ Belum Konfirmasi (${unconfirmedCount})`],
                      ['hadir', `✓ Sudah Hadir (${hadirCount})`],
                      ['tidak', `✕ Tidak Hadir (${tidakCount})`],
                    ].map(([st, label]) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
                          statusFilter === st
                            ? 'bg-ink text-ivory font-medium'
                            : 'bg-paper border border-ink/10 text-stone hover:border-ink/30'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 max-w-xs">
                    <Search size={14} className="absolute left-3 top-3 text-stone" />
                    <input
                      type="text"
                      placeholder="Cari nama atau no HP..."
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      className="w-full border border-ink/20 bg-paper py-2 pl-9 pr-3 text-xs focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                {messageMode === 'reminder' && (
                  <div className="bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-900 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Bell size={14} className="shrink-0" />
                      <span>Mode <strong>Pengingat RSVP</strong> aktif. Tombol Kirim WA akan mengirimkan teks reminder follow-up.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMessageMode('invitation')}
                      className="text-[11px] underline font-medium"
                    >
                      Kembali ke Undangan Awal
                    </button>
                  </div>
                )}

                <div className="grid gap-3">
                  {filteredGuests.map((g) => {
                    const url = invitationUrl(slug, g.name)
                    const msg = composeMessage(g.name, g.phone)
                    return (
                      <div key={g.raw} className="border border-ink/10 bg-paper p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="font-display text-xl">{g.name}</h4>
                            
                            {/* Status Badge */}
                            {g.status === 'hadir' && (
                              <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded font-medium">
                                ✓ Konfirmasi Hadir ({g.rsvp?.guests || 1} orang)
                              </span>
                            )}
                            {g.status === 'tidak' && (
                              <span className="bg-stone-200 text-stone-700 text-[10px] px-2 py-0.5 rounded font-medium">
                                ✕ Tidak Hadir
                              </span>
                            )}
                            {g.status === 'ragu' && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-medium">
                                ? Masih Ragu
                              </span>
                            )}
                            {g.status === 'unconfirmed' && (
                              <span className="bg-gold/15 text-gold-deep border border-gold/30 text-[10px] px-2 py-0.5 rounded font-medium">
                                Belum Konfirmasi
                              </span>
                            )}

                            {g.phone && (
                              <span className="bg-ink/5 border border-ink/10 px-2 py-0.5 text-xs text-stone font-mono">
                                {g.phone}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 break-all text-xs text-stone/80">{url}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em]">
                          <a
                            href={shareWaLink(msg, g.phone)}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-1.5 px-3 py-2 text-ivory transition-colors ${
                              messageMode === 'reminder' ? 'bg-gold-deep hover:bg-gold' : 'bg-ink hover:bg-gold-deep'
                            }`}
                          >
                            {messageMode === 'reminder' ? (
                              <>
                                <Bell size={12} /> Kirim Reminder WA
                              </>
                            ) : (
                              <>
                                <Send size={12} /> Kirim WA
                              </>
                            )}
                          </a>
                          <button
                            type="button"
                            onClick={async () => {
                              if (await copyText(url)) {
                                setCopied(g.name)
                                setTimeout(() => setCopied(''), 1200)
                              }
                            }}
                            className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 hover:bg-ink/5"
                          >
                            <Copy size={12} /> {copied === g.name ? 'Tersalin' : 'Salin Link'}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (await copyText(msg)) {
                                setCopiedMsg(g.name)
                                setTimeout(() => setCopiedMsg(''), 1200)
                              }
                            }}
                            className="inline-flex items-center gap-1.5 border border-ink/20 px-3 py-2 hover:bg-ink/5"
                          >
                            <Share2 size={12} /> {copiedMsg === g.name ? 'Pesan Tersalin' : 'Salin Pesan'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGuest(g.raw)}
                            className="inline-flex items-center p-2 text-stone hover:text-red-700 border border-transparent hover:border-red-200"
                            title="Hapus tamu"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
  )
}
