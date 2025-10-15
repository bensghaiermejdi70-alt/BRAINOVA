export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 27</h3><p>Cliquez pour lancer le jeu 27</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux27.html','Jeu 27');
  else window.open('../jeux27.html','_blank');
}
