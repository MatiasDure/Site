export const THEME_ATTRIBUTE = 'data-theme';
export const THEME_STORAGE_KEY = 'theme-preference';
export const THEME_MODES = ['light', 'dark'] as const;

export type ThemeMode = (typeof THEME_MODES)[number];

export function createThemeBootstrapScript() {
  return `(function(){try{var d=document.documentElement;var a='${THEME_ATTRIBUTE}';var k='${THEME_STORAGE_KEY}';var s=localStorage.getItem(k);var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.setAttribute(a,t);}catch(e){}})();`;
}