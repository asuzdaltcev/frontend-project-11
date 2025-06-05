// i18n.js
import i18next from 'i18next';

const resources = {
  ru: {
    translation: {
      // Основные тексты интерфейса
      appTitle: 'RSS Reader',
      appDescription: 'Добавляйте и читайте RSS-потоки',
      urlLabel: 'URL RSS-потока',
      urlPlaceholder: 'https://example.com/rss',
      urlExample: 'Пример: https://lorem-rss.herokuapp.com/feed',
      addButton: 'Добавить',
      loadingButton: 'Загрузка...',
      
      // Заголовки разделов
      feedsTitle: 'Фиды',
      postsTitle: 'Посты',
      feedsCount: 'Фиды ({{count}})',
      postsCount: 'Посты ({{count}})',
      
      // Названия по умолчанию
      noTitle: 'Без названия',
      noDescription: 'Без описания',
      readButton: 'Читать',
      
      // Сообщения об успехе
      success: {
        feedAdded: 'RSS поток успешно добавлен!'
      },
      
      // Коды ошибок валидации
      errors: {
        required: 'URL не может быть пустым',
        invalidUrl: 'Ссылка должна быть валидным URL',
        duplicate: 'RSS поток уже существует',
        validationError: 'Произошла ошибка при валидации',
        networkError: 'Ошибка сети',
        parsingError: 'Ошибка парсинга RSS'
      }
    }
  }
};

const init = () => {
  return i18next.init({
    lng: 'ru',
    fallbackLng: 'ru',
    debug: false,
    resources,
    interpolation: {
      escapeValue: false, // не нужно экранирование для DOM
    },
  });
};

export default { init, t: (key, options) => i18next.t(key, options) }; 