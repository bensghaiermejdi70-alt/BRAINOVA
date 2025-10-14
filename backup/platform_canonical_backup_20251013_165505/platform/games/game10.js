export default class Game10 {
  constructor(){ this.name='Demo Playground'; }
  getCardHTML(){ return `<div class="game-number">10</div><div class="game-title">Demo Playground</div><p>Terrain de jeu interactif</p>`; }
  async launch(){ const url='../jeux10.html'; window.OverlayManager.open(url,'Jeux 10 - Demo Playground'); }
}
export function getCardHTML(){ return new Game10().getCardHTML(); }
export function launch(){ return new Game10().launch(); }