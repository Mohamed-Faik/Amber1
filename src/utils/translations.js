// Translation data
const enTranslations = {
  nav: {
    homes: "Homes",
    experiences: "Experiences",
    services: "Services",
    addListing: "Add a listing",
    becomeHost: "Become a Host"
  },
  common: {
    search: "Search",
    login: "Log in",
    signup: "Sign up",
    logout: "Logout",
    profile: "Profile",
    settings: "Settings"
  },
  hero: {
    quote: "It's about people, not about stones"
  }
};

const frTranslations = {
  nav: {
    homes: "Maisons",
    experiences: "Expériences",
    services: "Services",
    addListing: "Ajouter une annonce",
    becomeHost: "Devenir hôte"
  },
  common: {
    search: "Rechercher",
    login: "Se connecter",
    signup: "S'inscrire",
    logout: "Déconnexion",
    profile: "Profil",
    settings: "Paramètres"
  },
  hero: {
    quote: "Il s'agit de personnes, pas de pierres"
  }
};

const nlTranslations = {
  nav: {
    homes: "Huizen",
    experiences: "Ervaringen",
    services: "Diensten",
    addListing: "Advertentie toevoegen",
    becomeHost: "Word gastheer"
  },
  common: {
    search: "Zoeken",
    login: "Inloggen",
    signup: "Registreren",
    logout: "Uitloggen",
    profile: "Profiel",
    settings: "Instellingen"
  },
  hero: {
    quote: "Het gaat om mensen, niet om stenen"
  }
};

const translations = {
  en: enTranslations,
  fr: frTranslations,
  nl: nlTranslations,
};

export const getTranslation = (language, key) => {
  const keys = key.split(".");
  let value = translations[language] || translations.en;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English if translation not found
      value = translations.en;
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey];
      }
      break;
    }
  }
  
  return value || key;
};

export const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "nl", name: "Nederlands", flag: "🇧🇪" },
];

