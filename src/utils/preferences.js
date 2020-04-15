import _ from 'lodash';

const DEFAULT_PREFERENCES = Object.assign({
  region: null,
  language: null,
  country: null,
  currency: null,
});
const DEFAULT_CURRENCY = 'USD';

export const PREFERENCES_STORE_KEY = 'user-preferences';

export const loadUserPreferences = locales => {
  let language = (window.navigator.browserLanguage || window.navigator.language || window.navigator.userLanguage).split('-');
  if (language && _.size(language) < 2) {
      language = ['en', 'US'];
  }
  const preferenceLanguage = language[0] && language[0];
  const preferenceCountry = language[1] && language[1].toUpperCase();

  const preferences = Object.assign({}, DEFAULT_PREFERENCES, {
    region: locales ? getCurrencyByRegion(preferenceCountry, locales) : '',
    language: preferenceLanguage,
    country: preferenceCountry,
    currency: locales ? getCurrencyByCountry(preferenceCountry, locales) : DEFAULT_CURRENCY
  });

  return preferences;
}

export const getCurrencyByRegion = (country, localesData) => {
  let region = '';
  _.each(localesData.countries, locale => {
    if (locale.name === country) {
      region = locale.region;
      return false;
    }
  });

  return region;
};

export const getCurrencyByCountry = (country, locales) => {
  let currency = DEFAULT_CURRENCY;
  _.each(locales, locale => {
    if (locale.countryCode === country) {
      currency = locale.currency;
      return false;
    }
  });

  return currency;
};

export const extractLocalesData = (locales) => {  
  const localesData = {
    countries: [],
    countriesToLanguages: {},
    countriesToCurrencies: {}
  };

  _.each(locales, (locale) => {
    localesData.countries.push({
      region: locale.region,
      code: locale.countryCode,
      name: locale.countryName
    });

    localesData.countriesToLanguages[locale.countryCode] = locale.languages;
    localesData.countriesToCurrencies[locale.countryCode] = locale.currency;
  });

  return localesData;
};
