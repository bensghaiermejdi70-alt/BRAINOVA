export default class Game17 {
  constructor(){ this.name='Jeu 17'; }
  getCardHTML(){ return `<div class="game-number">17</div><div class="game-title">Egypt Quiz</div><p>Quiz sur l'histoire égyptienne</p>`; }
  async launch(){ const url='../jeux17.html'; window.OverlayManager.open(url,'Jeux 17 - Egypt Quiz'); }
}
export function getCardHTML(){ return new Game17().getCardHTML(); }
export function launch(){ return new Game17().launch(); }