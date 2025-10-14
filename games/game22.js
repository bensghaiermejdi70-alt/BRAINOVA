export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 22</h3><p>Cliquez pour lancer le jeu 22</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux22.html','Jeu 22');
  else window.open('../jeux22.html','_blank');
}
