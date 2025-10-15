export default class Game11 {
  constructor(){ this.name='Quantum Monopoly'; }
  getCardHTML(){ return `<div class="game-number">11</div><div class="game-title">Quantum Monopoly</div><p>Monopoly quantique</p>`; }
  async launch(){ const url='../jeux11.html'; window.OverlayManager.open(url,'Jeux 11 - Quantum Monopoly'); }
}
export function getCardHTML(){ return new Game11().getCardHTML(); }
export function launch(){ return new Game11().launch(); }