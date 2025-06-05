// main.js
import './styles.css';
import onChange from 'on-change';
import createView from './view.js';
import { validateUrl } from './validation.js';
import i18n from './i18n.js';

const state = {
  form: {
    status: 'filling', // filling, processing, success, error
    error: null, // код ошибки вместо текста
  },
  feeds: [],
  posts: [],
};

const elements = {
  form: document.getElementById('rss-form'),
  urlInput: document.getElementById('url-input'),
  feedback: document.getElementById('feedback'),
  submitButton: null, // будет инициализирован позже
};

const handleFormSubmit = (watchedState) => {
  return (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const url = formData.get('url').trim();
    
    if (!url) {
      watchedState.form.status = 'error';
      watchedState.form.error = 'required';
      return;
    }

    watchedState.form.status = 'processing';
    
    const existingUrls = watchedState.feeds.map(feed => feed.url);
    
    validateUrl(url, existingUrls)
      .then((errorCode) => {
        if (errorCode) {
          watchedState.form.status = 'error';
          watchedState.form.error = errorCode;
          return;
        }
        
        // Симуляция добавления RSS фида
        const newFeed = {
          id: Date.now(),
          url,
          title: `RSS Feed ${watchedState.feeds.length + 1}`,
          description: `Описание для ${url}`,
        };
        
        watchedState.feeds.push(newFeed);
        watchedState.form.status = 'success';
        watchedState.form.error = null;
      })
      .catch(() => {
        watchedState.form.status = 'error';
        watchedState.form.error = 'validationError';
      });
  };
};

const init = () => {
  // Инициализируем i18next
  return i18n.init().then(() => {
    // Инициализируем submitButton после загрузки DOM
    elements.submitButton = document.getElementById('submit-button');
    
    const view = createView(state, elements, i18n);
    
    const watchedState = onChange(state, (path) => {
      if (path.startsWith('form')) {
        view.renderForm();
      }
      if (path.startsWith('feeds')) {
        view.renderFeeds();
      }
      if (path.startsWith('posts')) {
        view.renderPosts();
      }
    });

    elements.form.addEventListener('submit', handleFormSubmit(watchedState));
    
    // Устанавливаем фокус на поле ввода
    elements.urlInput.focus();
    
    // Устанавливаем переведенные атрибуты
    view.updateLabels();
  });
};

document.addEventListener('DOMContentLoaded', init); 