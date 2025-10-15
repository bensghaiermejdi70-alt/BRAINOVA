export default class Game2 {
  constructor(){ this.name='Jeu 2'; }
  getCardHTML(){ return `<div class="game-number">02</div><div class="game-title">Memory Quantique</div><p>Entraînez votre mémoire avec l'IA neurale adaptative</p>`; }
  async launch(){ const url='../jeux2brainova.html'; window.OverlayManager.open(url,'Jeux 2 - Memory Quantique'); }
}
export function getCardHTML(){ return new Game2().getCardHTML(); }
export function launch(){ return new Game2().launch(); }