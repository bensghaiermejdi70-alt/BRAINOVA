class LanguageManager {
  constructor(){
    this.currentLang='fr';
    this.translations = { fr: {}, en: {} };
    this.observers = new Set();
  }
  async loadTranslations(lang){
    // In this demo we use inline minimal translations
    if(this.translations[lang] && Object.keys(this.translations[lang]).length) return;
    const base = {
      game_title: 'Jeu',
      play: 'Jouer'
    };
    this.translations[lang] = Object.assign({}, base);
  }
  async setLanguage(lang){ await this.loadTranslations(lang); this.currentLang=lang; this.notify(); }
  t(key){ return (this.translations[this.currentLang] && this.translations[this.currentLang][key]) || key; }
  subscribe(cb){ this.observers.add(cb); }
  notify(){ this.observers.forEach(cb=>cb(this.currentLang)); }
}
window.LanguageManager = new LanguageManager();