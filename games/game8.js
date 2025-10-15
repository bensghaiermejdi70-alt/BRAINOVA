export default class Game8 {
  constructor(){ this.name='Speed Challenge'; }
  getCardHTML(){ return `<div class="game-number">08</div><div class="game-title">Speed Challenge</div><p>Défis de vitesse avec IA</p>`; }
  async launch(){ const url='../jeux8.html'; window.OverlayManager.open(url,'Jeux 8 - Speed Challenge'); }
}
export function getCardHTML(){ return new Game8().getCardHTML(); }
export function launch(){ return new Game8().launch(); }