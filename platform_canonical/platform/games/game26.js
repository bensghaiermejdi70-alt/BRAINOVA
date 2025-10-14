export default class Game26 {
  constructor(){ this.name='Jeu 26'; }
  getCardHTML(){ return `<div class="game-number">26</div><div class="game-title">Jeu 26</div><p>Description du jeu 26</p>`; }
  async launch(){ const url='../jeux26.html'; window.OverlayManager.open(url,'Jeux 26'); }
}
export function getCardHTML(){ return new Game26().getCardHTML(); }
export function launch(){ return new Game26().launch(); }