export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 30</h3><p>Cliquez pour lancer le jeu 30</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux30.html','Jeu 30');
  else window.open('../jeux30.html','_blank');
}
