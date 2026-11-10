/**
 * Site colour mode (light / dark) — html[data-mode].
 * Light is the default on a first visit, whatever the OS setting (team decision); a choice made with the toggle
 * is remembered.
 * The inline script runs before paint so the page never flashes the wrong mode.
 */
export type Mode = "light" | "dark";
export const MODE_STORAGE_KEY = "sahem-mode";

export const modeScript = `(function(){try{var m=localStorage.getItem('${MODE_STORAGE_KEY}');if(m!=='dark'){m='light'}document.documentElement.setAttribute('data-mode',m);var c=document.querySelector('meta[name="theme-color"]');if(c&&m==='dark')c.setAttribute('content','#0e0e10')}catch(e){document.documentElement.setAttribute('data-mode','light')}})();`;

export function getMode(): Mode {
  return document.documentElement.getAttribute("data-mode") === "dark" ? "dark" : "light";
}

/** Browser UI colour (mobile address bar) for each mode — the page background. */
export const themeColors: Record<Mode, string> = { light: "#f5f4f0", dark: "#0e0e10" };

export function setMode(mode: Mode): void {
  document.documentElement.setAttribute("data-mode", mode);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[mode]);
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* storage blocked (private mode): the choice lasts for this page only */
  }
}
