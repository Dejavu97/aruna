import {
  Camera,
  Check,
  Copy,
  Download,
  MessageCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { copyText } from '../../lib/utils'
import ImageAdjustModal from '../../components/ImageAdjustModal'

/** StudioModals — diekstrak verbatim dari ThemeStudio.jsx (Fase 3b). */
export default function StudioModals({ activeColorPalette,
  activeScriptFont,
  adjustTarget,
  colors,
  copiedProposal,
  customAssets,
  exportingPoster,
  handleDownloadInstagramPoster,
  handleSaveAdjustSettings,
  posterModalOpen,
  previewData,
  proposalLinkUrl,
  proposalModalOpen,
  setAdjustTarget,
  setCopiedProposal,
  setPosterModalOpen,
  setProposalModalOpen  }) {
  return (
    <>
      {/* 9:16 Instagram Story Poster Modal */}
    {posterModalOpen && (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-paper border border-ink/20 p-6 rounded-sm max-w-sm w-full shadow-2xl space-y-4 text-center">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-1.5">
              <Camera size={16} className="text-gold-deep" /> Poster Story IG (9:16)
            </h3>
            <button
              type="button"
              onClick={() => setPosterModalOpen(false)}
              className="text-stone hover:text-ink text-sm font-bold"
            >
              ✕
            </button>
          </div>

          {/* Poster 9:16 Canvas Preview Card */}
          <div
            className="w-full aspect-[9/16] rounded-xs border p-6 flex flex-col justify-between items-center text-center shadow-lg relative overflow-hidden"
            style={{
              backgroundColor: activeColorPalette.bg,
              color: activeColorPalette.fg,
            }}
          >
            <div className="relative z-10 space-y-1">
              <p className="text-[9px] uppercase tracking-[0.25em]" style={{ color: activeColorPalette.accent }}>
                THE WEDDING OF
              </p>
              <h4 className="text-2xl italic" style={{ fontFamily: activeScriptFont }}>
                {previewData.bride.nick} &amp; {previewData.groom.nick}
              </h4>
              <p className="text-[10px] font-mono font-bold" style={{ color: activeColorPalette.accent }}>
                20.11.2026
              </p>
            </div>

            {/* Photo */}
            <div className="w-36 h-36 rounded-full border-2 overflow-hidden my-2 shadow-md" style={{ borderColor: activeColorPalette.accent }}>
              <img src={customAssets.coverImgUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="relative z-10 space-y-1">
              <p className="text-[10px] font-bold">Grand Ballroom Hotel Mulia</p>
              <p className="text-[8px] opacity-75 uppercase tracking-wider">Scan Undangan Resmi di Aruna</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadInstagramPoster}
            disabled={exportingPoster}
            className="w-full bg-gold-deep text-ivory py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-gold transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Download size={14} /> {exportingPoster ? 'Mengekspor HD...' : 'Unduh Poster Story (PNG HD)'}
          </button>
        </div>
      </div>
    )}

    {/* Client Proposal Share Modal */}
    {proposalModalOpen && (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-paper border border-ink/20 p-6 rounded-sm max-w-md w-full shadow-2xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">Link Proposal Tema Klien</h3>
              <p className="text-xs text-stone mt-0.5">Kirim link demo tema ini ke WhatsApp calon pengantin.</p>
            </div>
            <button
              type="button"
              onClick={() => setProposalModalOpen(false)}
              className="text-stone hover:text-ink text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <div className="p-3 bg-white border border-ink/20 rounded-xs space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-stone font-semibold">Tautan Pratinjau Demo:</p>
            <p className="text-xs font-mono break-all text-ink">{proposalLinkUrl}</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(proposalLinkUrl)
                setCopiedProposal(true)
                setTimeout(() => setCopiedProposal(false), 2500)
              }}
              className="flex-1 border border-ink/20 p-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-ink/5 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              {copiedProposal ? <Check size={14} className="text-green-700" /> : <Copy size={14} />}
              {copiedProposal ? 'Tersalin!' : 'Salin Tautan'}
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Halo! Berikut rancangan tema undangan pernikahan spesial untuk Anda: ${proposalLinkUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-green-700 text-white p-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-green-800 transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageCircle size={14} /> Kirim WhatsApp
            </a>
          </div>
        </div>
      </div>
    )}

    {/* Image Adjuster Modal */}
    {adjustTarget && (
      <ImageAdjustModal
        target={adjustTarget}
        currentSettings={customAssets[adjustTarget.settingsKey] || {}}
        onSave={handleSaveAdjustSettings}
        onClose={() => setAdjustTarget(null)}
      />
    )}
    </>
  )
}


