import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, MapPin, Play, QrCode } from 'lucide-react'
import { countdownParts, formatLongDate, invitationUrl, copyText } from '../lib/utils'
import { addRsvp, addWish, fetchInvitation } from '../lib/api'

export default function BoardingInvitation({ data, guest = '', preview = false }) {
  const [open, setOpen] = useState(false)
  const [tick, setTick] = useState(() => countdownParts(data.date, data.events?.[0]?.time || '09:00'))
  const [copied, setCopied] = useState('')
  const [local, setLocal] = useState(data)

  useEffect(() => {
    const id = setInterval(() => setTick(countdownParts(data.date, data.events?.[0]?.time || '09:00')), 1000)
    return () => clearInterval(id)
  }, [data.date, data.events])

  useEffect(() => { setLocal(data) }, [data])

  const bride = data.bride?.nick || ''
  const groom = data.groom?.nick || ''
  const coverImg = data.gallery?.[0] || data.backdrop || '/themes/marmer.jpg'

  async function onCopy(value, key) {
    if (await copyText(value)) { setCopied(key); setTimeout(() => setCopied(''), 1600) }
  }

  return (
    <div className="bg-[#E2E8F0] min-h-screen text-[#0F172A] font-sans pb-10">
      {!open ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div 
            className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="bg-[#0284C7] p-4 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-80">Boarding Pass</p>
                <h1 className="font-mono text-2xl font-bold mt-1">FIRST CLASS</h1>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest opacity-80">Flight</p>
                <p className="font-mono text-xl">{data.date.replace(/-/g, '')}</p>
              </div>
            </div>
            
            <div className="p-6 border-b-2 border-dashed border-slate-300">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">Passenger</p>
                  <p className="font-bold text-xl mt-1">{guest || 'VIP Guest'}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center relative">
                <div className="text-center">
                  {data.bride?.photo && (
                    <img src={data.bride.photo} alt={bride} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-slate-200" />
                  )}
                  <h2 className="font-mono text-3xl sm:text-4xl text-[#0284C7] font-bold">{bride.substring(0, 3).toUpperCase()}</h2>
                  <p className="text-xs font-bold uppercase mt-1">{bride}</p>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative px-2">
                  <div className="h-[2px] w-full bg-slate-300 absolute"></div>
                  <div className="bg-white px-2 z-10 text-slate-400">✈</div>
                </div>
                
                <div className="text-center">
                  {data.groom?.photo && (
                    <img src={data.groom.photo} alt={groom} className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-slate-200" />
                  )}
                  <h2 className="font-mono text-3xl sm:text-4xl text-[#0284C7] font-bold">{groom.substring(0, 3).toUpperCase()}</h2>
                  <p className="text-xs font-bold uppercase mt-1">{groom}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Date</p>
                  <p className="font-mono font-bold">{formatLongDate(data.date)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">Boarding Time</p>
                  <p className="font-mono font-bold">{data.events?.[0]?.time || 'TBA'}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setOpen(true)}
                className="w-full mt-6 bg-[#0F172A] text-white py-4 rounded-lg font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 hover:bg-[#0284C7] transition-colors"
              >
                <Check size={16} /> Proceed to Gate
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative overflow-hidden">
          {/* Hero Image */}
          <div 
            className="w-full h-48 bg-slate-200 bg-cover bg-center" 
            style={{ backgroundImage: `url(${coverImg})` }}
          />
          
          {/* Header */}
          <header className="bg-[#0284C7] text-white p-6 sticky top-0 z-20 shadow-md border-t border-white/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-80">Destination</p>
                <h1 className="font-mono text-xl font-bold">FOREVER</h1>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest opacity-80">Gate</p>
                <p className="font-mono text-2xl font-bold">01</p>
              </div>
            </div>
          </header>
          
          <div className="p-6 space-y-10">
            {/* Countdown */}
            <section className="text-center">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">Time to Departure</p>
              <div className="flex justify-center gap-4 font-mono text-2xl text-[#0284C7] font-bold">
                <div>{tick.d}<span className="text-xs text-slate-500 block font-sans">Days</span></div>
                <div>{tick.h}<span className="text-xs text-slate-500 block font-sans">Hrs</span></div>
                <div>{tick.m}<span className="text-xs text-slate-500 block font-sans">Min</span></div>
                <div>{tick.s}<span className="text-xs text-slate-500 block font-sans">Sec</span></div>
              </div>
            </section>
            
            <hr className="border-dashed border-slate-300" />
            
            {/* Itinerary */}
            <section>
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-6">Flight Itinerary</p>
              <div className="space-y-6">
                {(data.events || []).map((ev, i) => (
                  <div key={i} className="flex gap-4 items-start relative">
                    <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold flex-shrink-0 z-10">
                      {i + 1}
                    </div>
                    {i !== (data.events || []).length - 1 && (
                      <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-slate-200"></div>
                    )}
                    <div className="bg-slate-50 p-4 rounded-lg flex-1 border border-slate-100">
                      <h3 className="font-bold text-lg">{ev.title}</h3>
                      <p className="text-sm font-mono text-slate-600 mt-1">{formatLongDate(ev.date)} • {ev.time}</p>
                      <p className="text-sm mt-2">{ev.venue}</p>
                      <p className="text-xs text-slate-500 mt-1">{ev.address}</p>
                      {ev.maps && (
                        <a href={ev.maps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#0284C7] mt-3 bg-[#E0F2FE] px-3 py-1.5 rounded-full font-bold">
                          <MapPin size={12} /> Open Maps
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            <hr className="border-dashed border-slate-300" />
            
            {/* Baggage Claim (Gifts) */}
            {(data.banks?.length > 0 || data.qris) && (
              <section>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-6">Baggage Claim (Gift)</p>
                <div className="grid gap-4">
                  {(data.banks || []).map((b, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">{b.bank}</p>
                        <p className="font-mono text-slate-600 my-1">{b.number}</p>
                        <p className="text-xs text-slate-500 uppercase">{b.name}</p>
                      </div>
                      <button 
                        onClick={() => onCopy(b.number, b.number)}
                        className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-[#0284C7] hover:bg-[#E0F2FE]"
                      >
                        {copied === b.number ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                  {data.qris && (
                    <div className="mt-2 text-center p-4 border-2 border-dashed border-slate-200 rounded-xl">
                      <p className="text-xs uppercase tracking-widest text-slate-500 mb-3">QRIS Scan</p>
                      <img src={data.qris} alt="QRIS" className="w-48 mx-auto mix-blend-multiply" />
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
          
          <div className="bg-[#0F172A] text-white p-6 mt-10 text-center">
            <p className="font-mono text-xs opacity-60">TICKET NO. {data.slug || 'ARUNA-01'}</p>
            <div className="mt-4 opacity-40">
              {/* Fake Barcode */}
              <div className="flex justify-center h-12">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="bg-white" style={{ width: Math.random() > 0.5 ? '2px' : '4px', margin: '0 1px' }}></div>
                ))}
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-widest mt-6 opacity-60">Powered by Aruna</p>
          </div>
        </div>
      )}
    </div>
  )
}
