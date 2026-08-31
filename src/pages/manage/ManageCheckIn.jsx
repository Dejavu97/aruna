import {
  Camera,
  Download,
  Search,
  UserCheck,
  UserX,
} from 'lucide-react'
import QrCameraScanner from '../../components/QrCameraScanner'
import { copyText } from '../../lib/utils'

/** ManageCheckIn — diekstrak verbatim dari Manage.jsx (Fase 3c, perilaku identik). */
export default function ManageCheckIn({ checkInFilter,
  checkInSearch,
  checkedInCount,
  exportCheckInCSV,
  filteredCheckInGuests,
  guests,
  guestsWithCheckIn,
  parsedGuests,
  recentCheckIn,
  setCheckInFilter,
  setCheckInSearch,
  setShowScanner,
  text,
  toggleCheckIn,
  totalCheckedInPax  }) {
  return (

          <div className="grid gap-6">
            {/* Check-In Header & Live Stats */}
            <div className="border border-ink/10 bg-paper p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gold-deep">Buku Tamu Digital &amp; Resepsi</p>
                  <h2 className="mt-1 font-display text-2xl">Buku Tamu &amp; VIP Check-In Lokasi</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="inline-flex items-center gap-2 bg-gold-deep text-ivory px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-gold transition-colors font-medium shadow-sm"
                  >
                    <Camera size={15} /> Scan QR Kamera
                  </button>
                  {guestsWithCheckIn.length > 0 && (
                    <button
                      type="button"
                      onClick={exportCheckInCSV}
                      className="inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-ink/5"
                    >
                      <Download size={14} /> Download Rekap (CSV)
                    </button>
                  )}
                </div>
              </div>

              {/* Live Stats */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                  <p className="font-display text-2xl text-green-700">{checkedInCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Tamu Tiba di Lokasi</p>
                </div>
                <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                  <p className="font-display text-2xl text-gold-deep">{totalCheckedInPax}</p>
                  <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Total Pax Hadir</p>
                </div>
                <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                  <p className="font-display text-2xl text-stone">{parsedGuests.length - checkedInCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Belum Hadir</p>
                </div>
                <div className="bg-ivory/60 border border-ink/10 p-4 text-center">
                  <p className="font-display text-2xl">{parsedGuests.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-stone mt-1">Total Undangan</p>
                </div>
              </div>

              {/* Instant Notification Toast */}
              {recentCheckIn && (
                <div className={`mt-4 p-3 border text-xs font-medium flex items-center justify-between ${
                  recentCheckIn.type === 'added' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-stone-100 border-stone-300 text-stone-700'
                }`}>
                  <span>
                    {recentCheckIn.type === 'added' ? `✓ Tamu "${recentCheckIn.name}" berhasil Check-In (${recentCheckIn.pax} orang)!` : `✕ Check-In tamu "${recentCheckIn.name}" dibatalkan.`}
                  </span>
                </div>
              )}

              {/* Quick Search & Fast Check-In Bar */}
              <div className="mt-6">
                <label className="block text-xs uppercase tracking-widest text-stone mb-2">
                  Cari Nama Tamu untuk Check-In Cepat
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-stone" />
                  <input
                    type="text"
                    placeholder="Ketik nama atau nomor HP tamu saat tiba di meja penerima tamu..."
                    value={checkInSearch}
                    onChange={(e) => setCheckInSearch(e.target.value)}
                    className="w-full border border-ink/20 bg-paper py-3 pl-10 pr-4 text-sm focus:border-ink focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  ['all', `Semua Tamu (${guestsWithCheckIn.length})`],
                  ['checkedIn', `✓ Sudah Tiba (${checkedInCount})`],
                  ['notYet', `⏳ Belum Tiba (${parsedGuests.length - checkedInCount})`],
                ].map(([f, label]) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setCheckInFilter(f)}
                    className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
                      checkInFilter === f
                        ? 'bg-ink text-ivory font-medium'
                        : 'bg-paper border border-ink/10 text-stone hover:border-ink/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-stone">
                Menampilkan {filteredCheckInGuests.length} tamu
              </p>
            </div>

            {/* Guest Check-In Cards */}
            <div className="grid gap-3">
              {filteredCheckInGuests.length === 0 ? (
                <div className="border border-ink/10 bg-paper p-8 text-center text-sm text-stone">
                  Tidak ada tamu yang sesuai pencarian atau filter.
                </div>
              ) : (
                filteredCheckInGuests.map((g) => {
                  const timeStr = g.checkInData?.checkInTime
                    ? new Date(g.checkInData.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                    : ''
                  return (
                    <div
                      key={g.raw}
                      className={`border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                        g.isCheckedIn ? 'bg-green-50/40 border-green-300' : 'bg-paper border-ink/10'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="font-display text-xl">{g.name}</h4>
                          {g.isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 bg-green-700 text-ivory text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                              <UserCheck size={12} /> Hadir di Lokasi ({g.checkInData?.pax || 1} orang)
                            </span>
                          ) : (
                            <span className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded font-medium uppercase tracking-wider">
                              Belum Tiba
                            </span>
                          )}
                          {g.phone && (
                            <span className="bg-ink/5 border border-ink/10 px-2 py-0.5 text-xs text-stone font-mono">
                              {g.phone}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-stone">
                          <span>RSVP: <strong>{g.status === 'hadir' ? `Hadir (${g.rsvp?.guests || 1} org)` : g.status === 'tidak' ? 'Tidak Hadir' : 'Belum Konfirmasi'}</strong></span>
                          {g.isCheckedIn && timeStr && (
                            <>
                              <span>·</span>
                              <span className="text-green-800 font-medium">Tiba Pk {timeStr} WIB</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        {g.isCheckedIn ? (
                          <button
                            type="button"
                            onClick={() => toggleCheckIn(g.name)}
                            className="inline-flex items-center gap-1.5 border border-red-300 text-red-700 bg-red-50/50 px-3 py-2 text-xs uppercase tracking-widest hover:bg-red-100"
                          >
                            <UserX size={12} /> Batalkan
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleCheckIn(g.name, g.rsvp?.guests || 1)}
                            className="inline-flex items-center gap-1.5 bg-ink text-ivory px-4 py-2 text-xs uppercase tracking-widest hover:bg-gold-deep transition-colors"
                          >
                            <UserCheck size={14} /> Check-In
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
  )
}
