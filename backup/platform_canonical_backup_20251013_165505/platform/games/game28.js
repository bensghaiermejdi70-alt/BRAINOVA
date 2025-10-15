export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 28</h3><p>Cliquez pour lancer le jeu 28</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux28.html','Jeu 28');
  else window.open('../jeux28.html','_blank');
}
