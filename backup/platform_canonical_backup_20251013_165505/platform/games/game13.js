export default class Game13 {
  constructor(){ this.name='Blackjack Quantum'; }
  getCardHTML(){ return `<div class="game-number">13</div><div class="game-title">Blackjack Quantum</div><p>Blackjack quantique</p>`; }
  async launch(){ const url='../jeux13.html'; window.OverlayManager.open(url,'Jeux 13 - Blackjack Quantum'); }
}
export function getCardHTML(){ return new Game13().getCardHTML(); }
export function launch(){ return new Game13().launch(); }