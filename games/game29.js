export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 29</h3><p>Cliquez pour lancer le jeu 29</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux29.html','Jeu 29');
  else window.open('../jeux29.html','_blank');
}
