export default class Game16 {
  constructor(){ this.name='Game16'; }
  getCardHTML(){ return `<div class="game-number">16</div><div class="game-title">Enigma Hunter</div><p>Chasseur d'énigmes quantiques</p>`; }
  async launch(){ const url='../jeux16.html'; window.OverlayManager.open(url,'Jeux 16 - Enigma Hunter'); }
}
export function getCardHTML(){ return new Game16().getCardHTML(); }
export function launch(){ return new Game16().launch(); }