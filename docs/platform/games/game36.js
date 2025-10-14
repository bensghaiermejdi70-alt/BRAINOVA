export default class Game36 {
  constructor(){ this.name='Jeu 36'; }
  getCardHTML(){ return `<div class="game-number">36</div><div class="game-title">Jeu 36</div><p>Description du jeu 36</p>`; }
  async launch(){ const url='../jeux36.html'; window.OverlayManager.open(url,'Jeux 36'); }
}
export function getCardHTML(){ return new Game36().getCardHTML(); }
export function launch(){ return new Game36().launch(); }