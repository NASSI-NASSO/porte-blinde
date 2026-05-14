import 'server-only';

const dictionaries = {
  fr: () => import('./fr.json').then((module) => module.default),
  ar: () => import('./ar.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  return dictionaries[locale]?.() ?? dictionaries.fr();
};
