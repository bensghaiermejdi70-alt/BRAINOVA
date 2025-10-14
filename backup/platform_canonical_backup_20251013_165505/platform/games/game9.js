export default class Game9 {
  constructor(){ this.name='Cyber Checker'; }
  getCardHTML(){ return `<div class="game-number">09</div><div class="game-title">Cyber Checker</div><p>Vérificateur cyber avec IA</p>`; }
  async launch(){ const url='../jeux9.html'; window.OverlayManager.open(url,'Jeux 9 - Cyber Checker'); }
}
export function getCardHTML(){ return new Game9().getCardHTML(); }
export function launch(){ return new Game9().launch(); }