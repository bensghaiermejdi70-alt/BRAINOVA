// Lightweight Sudoku generator worker
// Receives: { action: 'generate', difficulty: 'easy'|'medium'|'hard'|'expert', level: number }
// Responds: { solution: number[][], initial: number[][] }

function deepCopyGrid(g){ return g.map(r=>r.slice()); }

function shuffleSolution(grid){
    // Shuffle rows within each band
    for(let band=0; band<3; band++){
        const rows=[band*3, band*3+1, band*3+2];
        for(let i=rows.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            const ri=rows[i], rj=rows[j];
            const tmp=grid[ri]; grid[ri]=grid[rj]; grid[rj]=tmp;
        }
    }
    // Shuffle cols within each stack
    for(let band=0; band<3; band++){
        const cols=[band*3, band*3+1, band*3+2];
        for(let i=cols.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            const ci=cols[i], cj=cols[j];
            for(let r=0;r<9;r++){ const tmp=grid[r][ci]; grid[r][ci]=grid[r][cj]; grid[r][cj]=tmp; }
        }
    }
}

function baseSolution(){
    return [
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
    ];
}

function calculateCellsToRemove(difficulty, level){
    const baseDifficulty = {
        easy: 30,
        medium: 40,
        hard: 50,
        expert: 60
    };
    const levelIncrease = Math.min(20, Math.floor((level - 1) * 0.4));
    const toRemove = (baseDifficulty[difficulty] || 30) + levelIncrease;
    return Math.max(5, Math.min(64, toRemove));
}

onmessage = function(e){
    const data = e.data || {};
    if(data.action === 'generate'){
        const difficulty = data.difficulty || 'easy';
        const level = data.level || 1;

        // Build a solved grid and shuffle it
        const sol = baseSolution();
        shuffleSolution(sol);

        // Remove cells randomly to produce initial puzzle
        const toRemove = calculateCellsToRemove(difficulty, level);
        const positions = [];
        for(let i=0;i<81;i++) positions.push(i);
        // shuffle positions
        for(let i=positions.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=positions[i]; positions[i]=positions[j]; positions[j]=t; }

        const initial = deepCopyGrid(sol);
        for(let k=0;k<toRemove && k<positions.length;k++){
            const pos = positions[k];
            const r = Math.floor(pos/9), c = pos%9;
            initial[r][c] = 0;
        }

        postMessage({ solution: sol, initial: initial });
    }
};
