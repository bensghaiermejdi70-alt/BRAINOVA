export default class Game3 {
  constructor(){ this.name='Neural Puzzle Master'; }
  getCardHTML(){ return `<div class="game-number">03</div><div class="game-title">Neural Puzzle Master</div><p>Cliquez pour jouer !</p>`; }
  async launch(){ const url='../jeux3.html'; window.OverlayManager.open(url,'Jeux 3 - Neural Puzzle Master'); }
}
export function getCardHTML(){ return new Game3().getCardHTML(); }
export function launch(){ return new Game3().launch(); }