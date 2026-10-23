export const THEME_KEY = "arisestudio-theme";
export const THEME_EVENT = "arisestudio-theme";

// Apply before paint; keep one theme source for device, picker and other tabs.
export const themeScript = `(function(){
  var root=document.documentElement;
  var media=matchMedia("(prefers-color-scheme: dark)");
  function read(){
    try{return localStorage.getItem("${THEME_KEY}")}catch(e){return "system"}
  }
  function apply(value){
    var preference=value==="light"||value==="dark"?value:"system";
    root.dataset.themePreference=preference;
    root.classList.toggle("dark",preference==="dark"||(preference==="system"&&media.matches));
  }
  function update(value){
    window.dispatchEvent(new CustomEvent("${THEME_EVENT}",{detail:value}));
  }
  apply(read());
  window.addEventListener("${THEME_EVENT}",function(event){apply(event.detail)});
  media.addEventListener("change",function(){
    if(root.dataset.themePreference==="system")update("system");
  });
  window.addEventListener("storage",function(event){
    if(event.key==="${THEME_KEY}"||event.key===null)update(read());
  });
})()`;
