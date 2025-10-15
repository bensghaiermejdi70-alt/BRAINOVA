// Module for game1: fallback to HTML page (`jeux1super.html`) will be used if OverlayManager isn't available.
export const __disabled = false;
export async function launch(){
	const url = '../jeux1super.html';
	if(window && window.OverlayManager) return window.OverlayManager.open(url, 'Quantum Tetris');
	window.open(url, '_blank');
}