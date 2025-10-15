export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 20</h3><p>Cliquez pour lancer le jeu 20</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux20.html','Jeu 20');
  else window.open('../jeux20.html','_blank');
}
