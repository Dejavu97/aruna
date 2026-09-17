import { registerThemeComponent } from './themeRegistry'
import AttariInvitation from './AttariInvitation'
import BoardingInvitation from './BoardingInvitation'
import ThemeAdatJawa from './ThemeAdatJawa'
import ThemeArtJawaBiru from './ThemeArtJawaBiru'
import ThemeRoyalBunny from './ThemeRoyalBunny'
import ThemeWeddingGazette from './ThemeWeddingGazette'
import ThemeCinematicMinimal from './ThemeCinematicMinimal'
import ThemeCinematicLoveLetter from './ThemeCinematicLoveLetter'
import ThemeModernEditorialLetter from './ThemeModernEditorialLetter'
import ThemeKejora from './ThemeKejora'

// ===== Theme Registry (Fase 2 refactor) =====
// Satu pendaftaran per layout terisolasi. Tema baru cukup: entri di
// src/data/themes.js + komponen + satu baris registerThemeComponent di sini.
registerThemeComponent('kejora', ThemeKejora)
registerThemeComponent('modern-editorial-letter', ThemeModernEditorialLetter)
registerThemeComponent('cinematic-love-letter', ThemeCinematicLoveLetter)
registerThemeComponent('cinematic-minimal', ThemeCinematicMinimal)
registerThemeComponent('royal-bunny', ThemeRoyalBunny)
registerThemeComponent('adat-jawa', ThemeAdatJawa)
registerThemeComponent('art-jawa-biru', ThemeArtJawaBiru)
registerThemeComponent('attari', AttariInvitation)
registerThemeComponent('boarding', BoardingInvitation)
registerThemeComponent('wedding-gazette', ThemeWeddingGazette)
// Alias permanen slug lama 'jawa-biru' → komponen sama dengan 'art-jawa-biru'.
// JANGAN hapus dikira duplikat: undangan lama ber-slug jawa-biru masih memakainya.
registerThemeComponent('jawa-biru', ThemeArtJawaBiru)
