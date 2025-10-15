export function getCardHTML(){
  return `<div class="game-card"><h3>Jeu 31</h3><p>Cliquez pour lancer le jeu 31</p></div>`;
}
export function launch(){
  if(window.OverlayManager) window.OverlayManager.open('../jeux31.html','Jeu 31');
  else window.open('../jeux31.html','_blank');
}
