export default class Game15 {
  constructor(){ this.name='Jeu 15'; }
  getCardHTML(){ return `<div class="game-number">15</div><div class="game-title">Jeu 15</div><p>Description du jeu 15</p>`; }
  async launch(){ const url='../jeux15.html'; window.OverlayManager.open(url,'Jeux 15'); }
}
export function getCardHTML(){ return new Game15().getCardHTML(); }
export function launch(){ return new Game15().launch(); }