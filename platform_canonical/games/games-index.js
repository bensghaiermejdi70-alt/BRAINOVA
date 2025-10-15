const GamesIndex = (()=>{
  const meta = {
  0: { id: 0, title: 'Test QI', description: 'Test QI — Carte de vérification (Cartridge: carte_qi.html)', icon: '🧪', tags: ['test','qi'], players: '1', duration: '1-5 min', file: '../carte_qi.html' },
  1: { id: 1, title: 'Quantum Tetris', description: 'Quantum Tetris — Tetris quantique expérimental', icon: '🧩', tags: ['arcade','reflexe','quantum'], players: '1', duration: '3-10 min', file: 'jeux1super.html' },
  2: { id: 2, title: 'Quantum Memory', description: 'Memory quantique — retrouvez les paires d\'états', icon: '🧠', tags: ['memoire','puzzle','memory'], players: '1-2', duration: '2-8 min', file: 'jeux2brainova.html' },
    3: { id: 3, title: 'Neural Puzzle Master - IA Futuriste', description: 'Neural Puzzle Master - IA Futuriste', thumb: '', tags: ['puzzle'] },
    4: { id: 4, title: 'Brainova Quantum Chess - IA Quantique', description: 'Brainova Quantum Chess - IA Quantique', thumb: '', tags: ['strategie','societe'] },
    5: { id: 5, title: 'Brainova Quantum Dames - IA Futuriste', description: 'Brainova Quantum Dames - IA Futuriste', thumb: '', tags: ['strategie','societe'] },
    6: { id: 6, title: 'Quantum Pac-Man - IA Futuriste', description: 'Quantum Pac-Man - IA Futuriste', thumb: '', tags: ['arcade','reflexe'] },
    7: { id: 7, title: 'Simon Says - IA Futuriste', description: 'Simon Says - IA Futuriste', thumb: '', tags: ['memoire','reflexe'] },
    8: { id: 8, title: 'Speed Challenge - IA Futuriste', description: 'Speed Challenge - IA Futuriste', thumb: '', tags: ['reflexe','arcade'] },
    9: { id: 9, title: 'Cyber Checker - Connexion Quantique', description: 'Cyber Checker - Connexion Quantique', thumb: '', tags: ['puzzle'] },
    10: { id: 10, title: "DEMO PLAYGROUND - Terrain d'Entraînement Futuriste", description: "DEMO PLAYGROUND - Terrain d'Entraînement Futuriste", thumb: '', tags: ['arcade'] },
    11: { id: 11, title: 'Quantum Monopoly - Jeu de Plateau Futuriste', description: 'Quantum Monopoly - Jeu de Plateau Futuriste', thumb: '', tags: ['societe','strategie'] },
    12: { id: 12, title: 'Quantum Poker - Jeu de Poker Futuriste', description: 'Quantum Poker - Jeu de Poker Futuriste', thumb: '', tags: ['societe'] },
  13: { id: 13, title: 'Blackjack Quantum', description: 'Blackjack Quantum — jeu de cartes quantique', thumb: '', file: 'jeux13.html', tags: ['societe','strategie'] },
    14: { id: 14, title: 'Solitaire Fusion - Jeu de Cartes Futuriste', description: 'Solitaire Fusion - Jeu de Cartes Futuriste', thumb: '', tags: ['puzzle','societe'] },
    15: { id: 15, title: 'NeuroSynth Explorer - Brainova Premium', description: 'NeuroSynth Explorer - Brainova Premium', thumb: '', tags: ['puzzle'] },
    16: { id: 16, title: 'Enigma Hunter', description: 'Enigma Hunter', thumb: '', tags: ['puzzle'] },
    17: { id: 17, title: 'CyberRace Nexus - Prototypes 3D', description: 'CyberRace Nexus - Prototypes 3D', thumb: '', tags: ['arcade','reflexe'] },
    18: { id: 18, title: 'QUANTUM WARFARE 2.0 - Bataille Spatiale Futuriste', description: 'QUANTUM WARFARE 2.0 - Bataille Spatiale Futuriste', thumb: '', tags: ['strategie'] },
    19: { id: 19, title: 'Quantum Dots - Jeu Futuriste', description: 'Quantum Dots - Jeu Futuriste', thumb: '', tags: ['puzzle'] },
  20: { id: 20, title: 'Sudoku Futuriste AI', description: 'Sudoku Futuriste AI', thumb: '', file: 'jeux20.html', tags: ['puzzle','memoire'] },
    21: { id: 21, title: 'Pharaon Cyber - Empire Galactique', description: 'Pharaon Cyber - Empire Galactique', thumb: '', tags: ['puzzle'] },
    22: { id: 22, title: 'Quantum Pipes', description: 'Quantum Pipes', thumb: '', tags: ['puzzle'] },
    23: { id: 23, title: 'Neural Slot - Brainova AI Casino', description: 'Neural Slot - Brainova AI Casino', thumb: '', tags: ['arcade'] },
    24: { id: 24, title: 'Neural Dice - Jeu Futuriste avec IA', description: 'Neural Dice - Jeu Futuriste avec IA', thumb: '', tags: ['societe'] },
    25: { id: 25, title: 'Quantum Bubbles', description: 'Quantum Bubbles', thumb: '', tags: ['arcade','puzzle'] },
    26: { id: 26, title: 'Cyber Defense AI - Jeu Futuriste', description: 'Cyber Defense AI - Jeu Futuriste', thumb: '', tags: ['strategie'] },
    27: { id: 27, title: 'Cyber Pool - Billard Futuriste avec IA', description: 'Cyber Pool - Billard Futuriste avec IA', thumb: '', tags: ['societe'] },
    28: { id: 28, title: 'Quantum Tiles - Puzzle Futuriste avec IA', description: 'Quantum Tiles - Puzzle Futuriste avec IA', thumb: '', tags: ['puzzle'] },
    29: { id: 29, title: 'Genius Quest - Quiz Multilingue', description: 'Genius Quest - Quiz Multilingue', thumb: '', tags: ['quiz'] },
    30: { id: 30, title: 'Space Explorer - Aventure Galactique', description: 'Space Explorer - Aventure Galactique', thumb: '', tags: ['arcade','strategie'] },
    31: { id: 31, title: 'NeuroSphere - Jeu de Société Futuriste IA', description: 'NeuroSphere - Jeu de Société Futuriste IA', thumb: '', tags: ['societe'] },
    32: { id: 32, title: 'Skyjo Futuriste 3D', description: 'Skyjo Futuriste 3D', thumb: '', tags: ['societe'] },
    33: { id: 33, title: 'STELLAR NEXUS - Jeu Spatial Interactif', description: 'STELLAR NEXUS - Jeu Spatial Interactif', thumb: '', tags: ['arcade','strategie'] },
    34: { id: 34, title: 'Dixit Futuriste 3D - Voyage Imaginaire', description: 'Dixit Futuriste 3D - Voyage Imaginaire', thumb: '', tags: ['societe'] },
    35: { id: 35, title: 'Cyber Warrior - RPG Futuriste', description: 'Cyber Warrior - RPG Futuriste', thumb: '', tags: ['strategie'] },
  36: { id: 36, title: 'Crystal Quest - Puzzle Spatial', description: 'Crystal Quest - Puzzle Spatial', thumb: '', premium: true, tags: ['puzzle'] }
  };

  // Ensure every meta entry has a file property pointing to the expected root page.
  // This avoids relying on callers to construct ../ paths and makes resolution explicit.
  Object.keys(meta).forEach(k=>{
    const id = Number(k);
    if(!meta[k].file) meta[k].file = `../jeux${id}.html`;
  });

  // Mark premium and free ranges according to product policy:
  // - premium: id 0 and ids 11..36
  // - free: ids 1..10
  Object.keys(meta).forEach(k=>{
    const id = Number(k);
    if(id === 0 || (id >= 11 && id <= 36)) meta[k].premium = true;
    else if(id >= 1 && id <= 10) meta[k].free = true;
  });

  // If you sell a single "Pass Premium" via a Stripe Payment Link, set it
  // as the default paymentLink for all premium games so the 'Acheter' button
  // opens the hosted Payment Link (no server required). Replace the URL
  // below with your actual Payment Link.
  // For local testing you can set the Payment Link to redirect back to the
  // local served platform. Stripe Payment Links must be configured in the
  // Stripe dashboard to redirect to this URL after successful payment.
  const DEFAULT_PAYMENT_LINK = './global_platform_canonical.html?bundle_purchased=1';
  Object.keys(meta).forEach(k=>{
    if(meta[k].premium && !meta[k].paymentLink){
      meta[k].paymentLink = DEFAULT_PAYMENT_LINK;
    }
  });

  function getCardHTML(id){
    const m = meta[id];
    // Return only the inner markup for the card; outer `.game-card` element is
    // created by the platform shell (`platform/index.html`). Any per-card
    // decorations (accent background, glow) should be applied to the outer
    // element by calling `getCardStyle(id)` defined below.
    if(!m) return `
      <div class="game-header">
        <div class="game-number">${String(id).padStart(2,'0')}</div>
        <div class="game-status">–</div>
      </div>
      <div class="game-icon">🎮</div>
      <h3>Jeu ${id}</h3>
      <p>Ouvrir le jeu ${id}</p>
      <div class="game-tags"></div>
      <div class="game-stats"><span>--</span><span>--</span></div>
    `;

    return `
      <div class="game-header">
        <div class="game-number">${String(m.id).padStart(2,'0')}</div>
        <div class="game-status">${m.status||'–'}</div>
      </div>
      <div class="game-icon">${m.icon||'🎮'}</div>
      <h3>${m.title}</h3>
      <p>${m.description}</p>
      <div class="game-tags">${(m.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="game-stats"><span>${m.players||'--'}</span><span>${m.duration||'--'}</span></div>
      ${(() => {
        // Always show an Ouvrir button that triggers GamesIndex.launch via the platform
        const openBtn = `<button class="action-btn open-btn" data-open="${m.id}" style="background:linear-gradient(45deg,#00d4ff,#0088ff);color:#001;border:none;padding:8px 10px;border-radius:8px;cursor:pointer">Ouvrir</button>`;
        if(m.premium){
          // If a direct Stripe Payment Link is provided in meta.paymentLink,
          // render a plain anchor that opens the hosted Payment Link in a new
          // tab. This allows payments without any server-side Checkout session.
          // Otherwise fall back to the existing buy button that the platform
          // intercepts and sends to the create-checkout-session endpoint.
          const priceCents = m.priceCents || 499; // default 4.99 EUR
          const dataName = (m.title || (`Jeu ${m.id}`)).replace(/"/g,'');
          const buyHtml = m.paymentLink
            ? `<a class="action-btn buy-link" href="${m.paymentLink}" target="_blank" rel="noopener" style="display:inline-block;text-decoration:none;background:linear-gradient(45deg,#ffd700,#ff7a00);color:#001;padding:8px 10px;border-radius:8px;font-weight:800;border:none;cursor:pointer">Pass Premium</a>`
            : `<button class="action-btn buy-btn" data-game="${m.id}" data-price="${priceCents}" data-name="${dataName}" style="background:linear-gradient(45deg,#ffd700,#ff7a00);color:#001;padding:8px 10px;border-radius:8px;font-weight:800;border:none;cursor:pointer">Pass Premium</button>`;
          return `
            <div class="game-actions" style="margin-top:8px;display:flex;gap:8px;align-items:center;">
              ${openBtn}
              ${buyHtml}
            </div>
          `;
        }
        if(m.free){
          return `
            <div class="game-actions" style="margin-top:8px;display:flex;gap:8px;align-items:center;">
              ${openBtn}
              <button class="action-btn free-btn" data-open="${m.id}" style="background:linear-gradient(45deg,#00ff88,#00d4ff);color:#001;border:none;padding:8px 10px;border-radius:8px;font-weight:800;">Gratuit</button>
            </div>
          `;
        }
        // default (non categorized): just show open
        return `
          <div class="game-actions" style="margin-top:8px;display:flex;gap:8px;align-items:center;">
            ${openBtn}
          </div>
        `;
      })()}
    `;
  }

  // Provide a small helper so the platform shell can apply per-card outer styles.
  // Returns a CSS text string suitable for assignment to element.style.cssText.
  function getCardStyle(id){
    const m = meta[id];
    if(!m) return '';
    try{
      // Swap accent: card 0 should use the previous card 36 teal/cyan theme
      // and card 36 should fall back to the same behavior as card 35 (no
      // special accent by default unless tags dictate otherwise).
      if(Number(id) === 0){
        // Slightly darker luminous blue for better contrast (subtle shift)
        return 'background:linear-gradient(180deg,#cceff7,#33c9ff);border-color:#33c9ff;color:#001;box-shadow:0 10px 30px rgba(51,201,255,0.22);border-radius:10px;';
      }
      if(Number(id) === 36){
        // Make card 36 visually match card 35's default appearance: no
        // distinct accent here — allow tag-based styles below to still apply.
        return '';
      }
      if(Array.isArray(m.tags) && m.tags.indexOf('qi') !== -1){
        // Dark luminous magenta: apply to outer .game-card element
        return 'background:linear-gradient(180deg,#4a003f,#c10a8e);border-color:#C10A8E;color:#fff;box-shadow:0 8px 24px rgba(193,10,142,0.22);border-radius:10px;';
      }
    }catch(e){}
    return '';
  }

  function getCardTags(id){
    const m = meta[id];
    if(!m) return [];
    return Array.isArray(m.tags) ? m.tags.slice() : [];
  }

  function launch(id){
    const m = meta[id] || {};
    // Resolve the URL relative to the current page to avoid incorrect ../ resolution
    let raw = m.file ? m.file : `../jeux${id}.html`;
    let url;
    try{
      url = new URL(raw, window.location.href).href;
    }catch(e){
      // fallback to raw string if URL construction fails
      url = raw;
    }
    const title = m.title || `Jeu ${id}`;
    // Debug logging to help diagnose blank iframe issues
    if(window && window.console){ console.debug(`GamesIndex.launch id=${id} raw='${raw}' resolved='${url}'`); }

    // If the platform was opened from the filesystem (file://) many browsers block
    // iframe embedding or relative paths may resolve incorrectly. In that case
    // prefer the canonical local HTTP server URL so links open correctly.
    try{
      if(window && window.location && window.location.protocol === 'file:'){
        // Map the resolved URL's pathname to the canonical dev server.
        // Keep only the filename portion so we can point to the served equivalent.
        const filenameRaw = (new URL(url, 'http://example.com')).pathname.split('/').pop();
          if(filenameRaw){
            // If filename has no extension, prefer .html files (common in this project)
            const hasExt = /\.[a-zA-Z0-9]+$/.test(filenameRaw);
            const filename = hasExt ? filenameRaw : (filenameRaw + '.html');
            url = `./${filename}`;
            console.debug(`GamesIndex.launch adjusted for file:// -> '${url}'`);
          }
      }
    }catch(e){ /* ignore and use resolved url */ }

    if(window && window.OverlayManager) return window.OverlayManager.open(url,title);
    // fallback: open in new tab/window
    window.open(url,'_blank');
  }

  return { getCardHTML, getCardStyle, getCardTags, launch };
})();

export default GamesIndex;