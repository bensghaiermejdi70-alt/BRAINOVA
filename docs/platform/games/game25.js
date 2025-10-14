export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 25</h3><p>Cliquez pour lancer le jeu 25</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux25.html','Jeu 25');
  else window.open('../jeux25.html','_blank');
}
