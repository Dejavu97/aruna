import { useState } from 'react'
import { uploadFile } from '../../lib/api'

// Asset ingestion Studio: upload file, ekstraksi palet, upload font kustom,
// dan penyimpanan adjust-settings. Dipindah verbatim dari useStudioState.jsx
// (Stage 10A3); hook memakai thin wrapper agar return contract identik.
//
// Batas tegas: ingestion SAJA. Playback audio/voice (refs, play/pause,
// volume) tetap di useStudioState. Save/history/preview tidak tersentuh.
export function useStudioAssets({
  setCustomAssets,
  setColors,
  setFonts,
  setAnimKey,
  adjustTarget,
}) {
  const [uploadingAsset, setUploadingAsset] = useState('')
  const [extractingPalette, setExtractingPalette] = useState(false)

  async function handleAssetUpload(field, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAsset(field)
    try {
      const res = await uploadFile(file)
      if (field === 'customMusicUrl') {
        setCustomAssets((prev) => ({ ...prev, customMusicUrl: res.url, customMusicTitle: file.name }))
      } else if (field === 'voiceStoryUrl') {
        setCustomAssets((prev) => ({ ...prev, voiceStoryUrl: res.url, voiceStoryTitle: file.name }))
      } else {
        setCustomAssets((prev) => ({ ...prev, [field]: res.url }))
      }
    } catch (err) {
      alert(err.message || 'Gagal mengunggah aset.')
    } finally {
      setUploadingAsset('')
    }
  }

  // AI Color Palette Extractor from Photo
  function handleExtractPaletteFromPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setExtractingPalette(true)
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = 60
        canvas.height = 60
        ctx.drawImage(img, 0, 0, 60, 60)
        const imgData = ctx.getImageData(0, 0, 60, 60).data

        const sampleColors = []
        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i]
          const g = imgData[i + 1]
          const b = imgData[i + 2]
          const a = imgData[i + 3]
          if (a < 128) continue
          const max = Math.max(r, g, b) / 255
          const min = Math.min(r, g, b) / 255
          const l = (max + min) / 2
          const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
          sampleColors.push({ hex, r, g, b, l, s })
        }

        if (sampleColors.length > 0) {
          const bySat = [...sampleColors].sort((a, b) => b.s - a.s)
          const byLight = [...sampleColors].sort((a, b) => b.l - a.l)

          setColors({
            bg: byLight[0]?.hex || '#FDFBF7',
            paper: byLight[Math.floor(byLight.length * 0.1)]?.hex || '#FFFFFF',
            fg: byLight[byLight.length - 1]?.hex || '#1C1917',
            muted: byLight[Math.floor(byLight.length * 0.6)]?.hex || '#78716C',
            accent: bySat[0]?.hex || '#C5A059',
            accentSoft: bySat[Math.floor(bySat.length * 0.35)]?.hex || '#E6D3B0',
            cover: byLight[byLight.length - 1]?.hex || '#1C1917',
          })
          setAnimKey((k) => k + 1)
        }
        setExtractingPalette(false)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Custom Font File Upload
  function handleFontFileUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '')
    const reader = new FileReader()
    reader.onload = (event) => {
      const fontDataUrl = event.target.result
      const newStyle = document.createElement('style')
      newStyle.appendChild(document.createTextNode(`
        @font-face {
          font-family: '${cleanName}';
          src: url('${fontDataUrl}');
        }
      `))
      document.head.appendChild(newStyle)
      setFonts((prev) => ({
        ...prev,
        customFontName: cleanName,
        display: `"${cleanName}", serif`,
      }))
      alert(`Font kustom "${cleanName}" berhasil dimuat dan diterapkan!`)
    }
    reader.readAsDataURL(file)
  }

  function handleSaveAdjustSettings(newSettings) {
    if (!adjustTarget) return
    const { settingsKey } = adjustTarget
    setCustomAssets((prev) => ({
      ...prev,
      [settingsKey]: newSettings,
    }))
  }

  return {
    uploadingAsset,
    setUploadingAsset,
    extractingPalette,
    setExtractingPalette,
    handleAssetUpload,
    handleExtractPaletteFromPhoto,
    handleFontFileUpload,
    handleSaveAdjustSettings,
  }
}
