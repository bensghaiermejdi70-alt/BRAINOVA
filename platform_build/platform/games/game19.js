export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 19</h3><p>Cliquez pour lancer le jeu 19</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux19.html','Jeu 19');
  else window.open('../jeux19.html','_blank');
}
