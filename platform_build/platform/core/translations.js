window.AppTranslations = {
  fr: { play: 'Jouer', close: 'Fermer' },
  en: { play: 'Play', close: 'Close' }
};
window.AppLang = 'fr';
window.getT = function(k){ return (window.AppTranslations[window.AppLang] && window.AppTranslations[window.AppLang][k]) || k; };