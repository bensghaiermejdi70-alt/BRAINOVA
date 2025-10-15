class GameLoader{
  constructor(){ this.loadedStyles = new Set(); this.instances = new Map(); }
  async loadGameStyles(gameId){ if(this.loadedStyles.has(gameId)) return; const link=document.createElement('link'); link.rel='stylesheet'; link.href = `../styles/games/game${gameId}.css`; link.onload = ()=>this.loadedStyles.add(gameId); document.head.appendChild(link); }
  async loadGameModule(gameId){ return import(`../games/game${gameId}.js`); }
  async launchGame(gameId){ const m = await this.loadGameModule(gameId); if(m && typeof m.launch === 'function') return m.launch(); }
}
window.GameLoader = new GameLoader();