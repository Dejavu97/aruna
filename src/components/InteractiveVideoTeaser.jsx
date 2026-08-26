import { useState, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Sparkles, Smartphone, Eye, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

const DEMO_VIDEOS = [
  {
    id: 'bunny_featured',
    title: 'Tema Unggulan: Royal Bunny Fairytale',
    tag: 'Royal Bunny Showcase',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: '/themes/kelinci/cover.jpg',
    link: '/tema/royal-bunny',
    couple: 'Sarah & Budi · Royal Bunny',
    date: 'Full HD 60 FPS · Living Fairytale Experience',
  },
  {
    id: 'birthday',
    title: 'Perayaan Ulang Tahun: Sweet 17th',
    tag: 'Birthday Motion',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: '/assets/local/birthday_party_cover.jpg',
    link: '/tema/sweet-seventeen',
    couple: 'Sarah Bella (17th)',
    date: 'Pesta & Countdown Interaktif',
  },
  {
    id: 'capsule',
    title: 'Surat Romantis & Kapsul Kenangan',
    tag: 'Love Letter Capsule',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: '/assets/local/couple_garden.jpg',
    link: '/tema/birthday-memory-capsule',
    couple: 'Untuk Sarah · Birthday Love Letter',
    date: 'Surat Cinta & Kilas Balik Pasangan',
  },
]

export default function InteractiveVideoTeaser() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)

  const activeDemo = DEMO_VIDEOS[activeIdx]

  function togglePlay() {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  function toggleMute() {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section className="py-20 relative overflow-hidden bg-ivory/50 border-y border-ink/10">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border border-gold-deep/30 bg-gold/10 px-3.5 py-1 text-xs uppercase tracking-widest text-gold-deep font-semibold">
              <Sparkles size={13} />
              <span>Living Digital Experience</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              Animasi 60 FPS Mulus, Musik Latar &amp; Pesan Suara.
            </h2>

            <p className="text-stone text-sm sm:text-base leading-relaxed">
              Bukan sekadar gambar mati atau kartu PDF. Setiap undangan di Aruna dirancang hidup di layar smartphone para tamu: amplop terbuka anggun, musik latar mengalun lembut, dan efek visual bergerak saat layar digeser.
            </p>

            {/* Video Selector Tabs */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-ink">
                Pilih Cuplikan Live Teaser:
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO_VIDEOS.map((demo, idx) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => {
                      setActiveIdx(idx)
                      setIsPlaying(true)
                    }}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-xs border transition-colors ${
                      activeIdx === idx
                        ? 'bg-ink text-ivory border-ink shadow-xs'
                        : 'bg-white text-stone border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    {demo.tag} · {demo.couple}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Feature Bullet Points */}
            <div className="grid sm:grid-cols-2 gap-3 pt-3">
              <div className="border border-ink/10 bg-paper p-3.5 rounded-xs space-y-1">
                <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-deep" /> Audio Ganda &amp; Voice Note
                </p>
                <p className="text-[11px] text-stone leading-normal">
                  Putar lagu romantis dan rekaman suara ucapan pengantin secara jernih.
                </p>
              </div>

              <div className="border border-ink/10 bg-paper p-3.5 rounded-xs space-y-1">
                <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-deep" /> Buku Tamu &amp; Scanner QR
                </p>
                <p className="text-[11px] text-stone leading-normal">
                  Check-in kehadiran cepat di meja tamu langsung menggunakan kamera HP.
                </p>
              </div>

              <div className="border border-ink/10 bg-paper p-3.5 rounded-xs space-y-1">
                <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-deep" /> Amplop Digital &amp; QRIS
                </p>
                <p className="text-[11px] text-stone leading-normal">
                  Kirim kado tanpa ribet dengan fitur salin nomor rekening dan scan QRIS.
                </p>
              </div>

              <div className="border border-ink/10 bg-paper p-3.5 rounded-xs space-y-1">
                <p className="text-xs font-bold text-ink flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-deep" /> Kartu QR Kado Fisik
                </p>
                <p className="text-[11px] text-stone leading-normal">
                  Ekspor kartu QR bentuk Hati siap cetak untuk diselipkan di buket kado.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={activeDemo.link}
                className="bg-gold-deep text-ivory px-7 py-3.5 text-xs uppercase tracking-[0.16em] font-semibold hover:bg-gold transition-colors inline-flex items-center gap-2 shadow-xs"
              >
                <Eye size={14} /> Buka Undangan Demo Ini <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Realistic Smartphone Mockup Video Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[310px]">
              {/* Phone Outer Chassis / Curved Titanium Bezel */}
              <div className="relative rounded-[42px] border-[10px] border-[#1C1917] bg-[#1C1917] shadow-2xl p-1.5 ring-1 ring-white/20">
                
                {/* Dynamic Island / Top Camera Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-24 h-4 bg-black rounded-full flex items-center justify-end px-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-[#222]" />
                </div>

                {/* Inner Screen Area */}
                <div className="relative rounded-[32px] overflow-hidden aspect-[9/18] bg-black">
                  <video
                    ref={videoRef}
                    key={activeDemo.url}
                    src={activeDemo.url}
                    poster={activeDemo.poster}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Top Subtle Gradient */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                  {/* Bottom Video Floating Overlay Info */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-2">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-gold font-bold px-2 py-0.5 bg-black/50 rounded-full border border-gold/30">
                        {activeDemo.tag}
                      </span>
                      <p className="font-display text-lg font-bold mt-1 text-white">
                        {activeDemo.couple}
                      </p>
                      <p className="text-[10px] text-white/75">{activeDemo.date}</p>
                    </div>

                    {/* Video Player Floating Controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                          title={isPlaying ? 'Pause Video' : 'Play Video'}
                        >
                          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                        >
                          {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        </button>
                      </div>

                      <Link
                        to={activeDemo.link}
                        className="text-[10px] uppercase font-bold tracking-wider text-gold hover:underline flex items-center gap-1"
                      >
                        Buka Demo <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-2" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
