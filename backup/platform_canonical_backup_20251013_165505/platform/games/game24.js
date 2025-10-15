export default class Game24 {
  constructor(){ this.name='Jeu 24'; }
  getCardHTML(){ return `<div class="game-number">24</div><div class="game-title">Jeu 24</div><p>Description courte du jeu 24</p>`; }
  async launch(){ const url='../jeux24.html'; window.OverlayManager.open(url,'Jeux 24'); }
}
export function getCardHTML(){ return new Game24().getCardHTML(); }
export function launch(){ return new Game24().launch(); }