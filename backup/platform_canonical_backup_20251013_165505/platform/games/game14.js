export default class Game14 {
  constructor(){ this.name='Solitaire Fusion'; }
  getCardHTML(){ return `<div class="game-number">14</div><div class="game-title">Solitaire Fusion</div><p>Solitaire fusionné</p>`; }
  async launch(){ const url='../jeux14.html'; window.OverlayManager.open(url,'Jeux 14 - Solitaire Fusion'); }
}
export function getCardHTML(){ return new Game14().getCardHTML(); }
export function launch(){ return new Game14().launch(); }