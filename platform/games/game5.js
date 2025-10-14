export default class Game5 {
  constructor(){ this.name='Jeu 5'; }
  getCardHTML(){ return `<div class="game-number">05</div><div class="game-title">Jeux de Dames</div><p>Dames classiques avec IA stratégique</p>`; }
  async launch(){ const url='../jeux5.html'; window.OverlayManager.open(url,'Jeux 5 - Jeux de Dames'); }
}
export function getCardHTML(){ return new Game5().getCardHTML(); }
export function launch(){ return new Game5().launch(); }