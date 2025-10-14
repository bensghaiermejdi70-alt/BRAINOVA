export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 23</h3><p>Cliquez pour lancer le jeu 23</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux23.html','Jeu 23');
  else window.open('../jeux23.html','_blank');
}
