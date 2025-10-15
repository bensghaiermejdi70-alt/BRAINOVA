// Auto-generated games list
const gamesList = [
  {
    "file": "../carteqi.html",  // jeu0
    "title": "jeu0"
  },
  {
    "file": "jeux1super.html",
    "title": "jeux1"
  },
  {
    "file": "jeux2brainova.html",
    "title": "jeux2"
  },
  {
    "file": "jeux3.html",
    "title": "jeux3"
  },
  {
    "file": "jeux4.html",
    "title": "jeux4"
  },
  {
    "file": "jeux5.html",
    "title": "jeux5"
  },
  {
    "file": "jeux6.html",
    "title": "jeux6"
  },
  {
    "file": "jeux7.html",
    "title": "jeux7"
  },
  {
    "file": "jeux8.html",
    "title": "jeux8"
  },
  {
    "file": "jeux9.html",
    "title": "jeux9"
  },
  {
    "file": "jeux10.html",
    "title": "jeux10"
  },
  {
    "file": "jeux11.html",
    "title": "jeux11"
  },
  {
    "file": "jeux12.html",
    "title": "jeux12"
  },
  {
    "file": "jeux13super.html",
    "title": "jeux13"
  },
  {
    "file": "jeux14.html",
    "title": "jeux14"
  },
  {
    "file": "jeux15.html",
    "title": "jeux15"
  },
  {
    "file": "jeux16.html",
    "title": "jeux16"
  },
  {
    "file": "jeux17.html",
    "title": "jeux17"
  },
  {
    "file": "jeux18.html",
    "title": "jeux18"
  },
  {
    "file": "jeux19.html",
    "title": "jeux19"
  },
  {
    "file": "jeux20super.html",
    "title": "jeux20"
  },
  {
    "file": "jeux21.html",
    "title": "jeux21"
  },
  {
    "file": "jeux22.html",
    "title": "jeux22"
  },
  {
    "file": "jeux23.html",
    "title": "jeux23"
  },
  {
    "file": "jeux24.html",
    "title": "jeux24"
  },
  {
    "file": "jeux25.html",
    "title": "jeux25"
  },
  {
    "file": "jeux26.html",
    "title": "jeux26"
  },
  {
    "file": "jeux27.html",
    "title": "jeux27"
  },
  {
    "file": "jeux28.html",
    "title": "jeux28"
  },
  {
    "file": "jeux29.html",
    "title": "jeux29"
  },
  {
    "file": "jeux30.html",
    "title": "jeux30"
  },
  {
    "file": "jeux31.html",
    "title": "jeux31"
  },
  {
    "file": "jeux32.html",
    "title": "jeux32"
  },
  {
    "file": "jeux33.html",
    "title": "jeux33"
  },
  {
    "file": "jeux34.html",
    "title": "jeux34"
  },
  {
    "file": "jeux35.html",
    "title": "jeux35"
  },
  {
    "file": "jeux36.html",
    "title": "jeux36"
  }
];

// Loader: injecte les cartes dans #games-container
(function(){
  function createCard(g){
    var c = document.createElement('div');
    c.className = 'game-card';
    c.innerHTML = '<h3>'+ (g.title || 'Jeu') +'</h3>'
      + '<div class="iframe-wrap"><iframe src="'+ g.file +'" title="'+ (g.title||'jeu') +'" loading="lazy" frameborder="0"></iframe></div>'
      + '<div class="play-overlay"><a href="'+ g.file +'" target="_blank">Ouvrir</a></div>';
    return c;
  }
  window.addEventListener('DOMContentLoaded', function(){
    var cont = document.getElementById('games-container');
    if(!cont){ console.warn('games-container introuvable'); return; }
    gamesList.forEach(function(g){ cont.appendChild(createCard(g)); });
  });
})();
