export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 18</h3><p>Cliquez pour lancer le jeu 18</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux18.html','Jeu 18');
  else window.open('../jeux18.html','_blank');
}
