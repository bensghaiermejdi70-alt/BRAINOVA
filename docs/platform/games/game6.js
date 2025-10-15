export default class Game6 {
  constructor(){ this.name='Pac-Man'; }
  getCardHTML(){ return `<div class="game-number">06</div><div class="game-title">Pac-Man</div><p>Le légendaire Pac-Man</p>`; }
  async launch(){ const url='../jeux6.html'; window.OverlayManager.open(url,'Jeux 6 - Pac-Man'); }
}
export function getCardHTML(){ return new Game6().getCardHTML(); }
export function launch(){ return new Game6().launch(); }