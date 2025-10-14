export default class Game7 {
  constructor(){ this.name='Simon Says'; }
  getCardHTML(){ return `<div class="game-number">07</div><div class="game-title">Simon Says</div><p>Mémoire séquentielle</p>`; }
  async launch(){ const url='../jeux7.html'; window.OverlayManager.open(url,'Jeux 7 - Simon Says'); }
}
export function getCardHTML(){ return new Game7().getCardHTML(); }
export function launch(){ return new Game7().launch(); }