export default class Game4 {
  constructor(){ this.name='Quantum Chess'; }
  getCardHTML(){ return `<div class="game-number">04</div><div class="game-title">Quantum Chess</div><p>Échecs quantiques multidimensionnels</p>`; }
  async launch(){ const url='../jeux4.html'; window.OverlayManager.open(url,'Jeux 4 - Quantum Chess'); }
}
export function getCardHTML(){ return new Game4().getCardHTML(); }
export function launch(){ return new Game4().launch(); }