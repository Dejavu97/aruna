import { copyText } from '../../lib/utils'

/** ManageUcapan — diekstrak verbatim dari Manage.jsx (Fase 3c, perilaku identik). */
export default function ManageUcapan({ handleReply,
  item,
  replyText,
  replying,
  replyingTo,
  setReplyText,
  setReplyingTo,
  tab,
  text }) {
  return (

          <div className="border border-ink/10 bg-paper">
            {(item?.wishes || []).length === 0 ? (
              <p className="p-6 text-sm text-stone">Belum ada ucapan.</p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {(item.wishes || []).map((w) => (
                  <li key={w.id} className="px-5 py-4">
                    <p className="font-medium">{w.name}</p>
                    <p className="mt-1 text-sm text-stone">{w.message}</p>
                    
                    {w.reply ? (
                      <div className="mt-3 bg-ivory/50 p-3 border-l-2 border-gold text-sm text-stone">
                        <p className="font-medium text-xs uppercase tracking-widest mb-1 text-gold-deep">Balasan Anda</p>
                        <p>{w.reply}</p>
                      </div>
                    ) : (
                      <div className="mt-3">
                        {replyingTo === w.id ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              className="w-full border border-ink/20 bg-transparent p-3 text-sm focus:border-ink focus:outline-none"
                              rows="2"
                              placeholder="Ketik balasan Anda..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              disabled={replying}
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleReply(w.id)}
                                disabled={replying || !replyText.trim()}
                                className="bg-ink px-4 py-2 text-[10px] uppercase tracking-widest text-ivory hover:bg-gold-deep disabled:opacity-50"
                              >
                                {replying ? 'Menyimpan...' : 'Kirim Balasan'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingTo(null)
                                  setReplyText('')
                                }}
                                disabled={replying}
                                className="border border-ink/20 px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-ink/5"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(w.id)
                              setReplyText('')
                            }}
                            className="text-xs uppercase tracking-widest text-gold-deep underline hover:text-ink"
                          >
                            Balas Ucapan
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
  )
}
