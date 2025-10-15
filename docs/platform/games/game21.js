export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 21</h3><p>Cliquez pour lancer le jeu 21</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux21.html','Jeu 21');
  else window.open('../jeux21.html','_blank');
}
