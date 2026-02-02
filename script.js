/* Minimal JS: reload and open controls.
   The iframe intentionally does NOT allow fullscreen (no allowfullscreen).
*/
const iframe = document.getElementById('game-frame');
const reloadBtn = document.getElementById('reload');
const openNewBtn = document.getElementById('open-new');

reloadBtn.addEventListener('click', () => {
  // Quick visual feedback
  reloadBtn.disabled = true;
  iframe.src = iframe.src.split('#')[0]; // reset
  setTimeout(() => reloadBtn.disabled = false, 800);
});

openNewBtn.addEventListener('click', () => {
  // Open the same URL in a new tab
  window.open(iframe.src, '_blank', 'noopener,noreferrer');
});

// Ensure iframe always fills the available space (redundant with CSS,
// but useful if viewport changes)
const resize = () => {
  iframe.style.height = `${document.getElementById('frame-wrap').clientHeight}px`;
};
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);
resize();
