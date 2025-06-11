// i18n.js
import i18next from 'i18next'
import { ru } from './locales/ru.js'
import { en } from './locales/en.js'

const resources = {
  ru,
  en,
}

const init = () => {
  return i18next.init({
    lng: 'ru',
    fallbackLng: 'ru',
    debug: false,
    resources,
    interpolation: {
      escapeValue: false, // не нужно экранирование для DOM
    },
  })
}

export default { init, t: (key, options) => i18next.t(key, options) }
