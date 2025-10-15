export default class Game12 {
  constructor(){ this.name='Neural Poker'; }
  getCardHTML(){ return `<div class="game-number">12</div><div class="game-title">Neural Poker</div><p>Poker intelligent avec IA</p>`; }
  async launch(){ const url='../jeux12.html'; window.OverlayManager.open(url,'Jeux 12 - Neural Poker'); }
}
export function getCardHTML(){ return new Game12().getCardHTML(); }
export function launch(){ return new Game12().launch(); }