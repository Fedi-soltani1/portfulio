import { DEFAULT_THEME, STORAGE_KEY } from './theme';

/**
 * Injected inline in <head> and executed before first paint.
 *
 * It reads the stored theme (or the system preference) and sets
 * data-theme before any CSS paints. Waiting for hydration would show the
 * default theme for a frame and then snap — the flash every dual-theme
 * site gets wrong.
 *
 * It no longer touches <html lang>: the shell now renders inside the
 * [locale] segment, so the server emits the correct language directly.
 */
export const THEME_SCRIPT = `
(function(){
  try{
    var s = localStorage.getItem('${STORAGE_KEY}');
    var t = (s === 'ivory' || s === 'indigo')
      ? s
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'indigo' : '${DEFAULT_THEME}');
    document.documentElement.setAttribute('data-theme', t);
  }catch(e){
    document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');
  }
})();
`.trim();
