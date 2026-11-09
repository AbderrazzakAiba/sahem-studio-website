/**
 * Site colour mode (light / dark) — html[data-mode].
 * First visit follows the OS (prefers-color-scheme); a choice made with the toggle is remembered.
 * The inline script runs before paint so the page never flashes the wrong mode.
 */
export type Mode = "light" | "dark";
export const MODE_STORAGE_KEY = "sahem-mode";

export const modeScript = `(function(){try{var m=localStorage.getItem('${MODE_STORAGE_KEY}');if(m!=='light'&&m!=='dark'){m=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-mode',m)}catch(e){document.documentElement.setAttribute('data-mode','light')}})();`;

export function getMode(): Mode {
  return document.documentElement.getAttribute("data-mode") === "dark" ? "dark" : "light";
}

export function setMode(mode: Mode): void {
  document.documentElement.setAttribute("data-mode", mode);
  try {
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    /* storage blocked (private mode): the choice lasts for this page only */
  }
}
