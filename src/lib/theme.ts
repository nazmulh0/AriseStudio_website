export const THEME_KEY = "arisestudio-theme";

// Runs before the body paints so the stored preference never flashes the other theme.
export const themeScript = `(function(){var dark=false;try{var t=localStorage.getItem("${THEME_KEY}");dark=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){dark=matchMedia("(prefers-color-scheme: dark)").matches}document.documentElement.classList.toggle("dark",dark)})()`;
