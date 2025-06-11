// ru.js - Russian localization
export const ru = {
  translation: {
    // Основные тексты интерфейса
    appTitle: 'RSS агрегатор',
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
    
    // Стандартные названия
    noTitle: 'Нет заголовка',
    noDescription: 'Нет описания',
    readButton: 'Читать',
    
    // Модальное окно
    modal: {
      previewTitle: 'Предпросмотр поста',
      readFullArticle: 'Читать статью полностью',
      close: 'Закрыть',
      preview: 'Просмотр',
      openArticle: 'Открыть статью'
    },
    
    // Сообщения об успехе
    success: {
      feedAdded: 'RSS успешно загружен'
    },
    
    // Коды ошибок - точные тексты для тестов
    errors: {
      required: 'Не должно быть пустым',
      invalidUrl: 'Ссылка должна быть валидным URL',
      duplicate: 'RSS уже существует',
      validationError: 'Произошла ошибка валидации',
      networkError: 'Ошибка сети',
      invalidRSS: 'Ресурс не содержит валидный RSS'
    }
  }
}; 