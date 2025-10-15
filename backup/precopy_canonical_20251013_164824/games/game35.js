export default class Game35 {
  constructor(){ this.name='Jeu 35'; }
  getCardHTML(){ return `<div class="game-number">35</div><div class="game-title">Jeu 35</div><p>Description du jeu 35</p>`; }
  async launch(){ const url='../jeux35.html'; window.OverlayManager.open(url,'Jeux 35'); }
}
export function getCardHTML(){ return new Game35().getCardHTML(); }
export function launch(){ return new Game35().launch(); }