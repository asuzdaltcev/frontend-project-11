// main.js
import './styles.css'
import onChange from 'on-change'
import { Modal } from 'bootstrap'
import createView from './view.js'
import { validateUrl } from './validation.js'
import { fetchRSS } from './rss.js'
import i18n from './i18n.js'

const markPostAsRead = (watchedState, postId) => {
  if (!watchedState.readPosts.has(postId)) {
    watchedState.readPosts.add(postId)
    // Принудительно обновляем отображение постов
    watchedState.posts = [...watchedState.posts]
  }
}

const showPostPreview = (watchedState, postId, elements) => {
  const post = watchedState.posts.find(p => p.id === postId)
  if (!post) return

  // Помечаем пост как прочитанный
  markPostAsRead(watchedState, postId)

  // Заполняем модальное окно
  elements.modalTitle.textContent = post.title || 'Нет заголовка'
  elements.modalDescription.innerHTML = post.description || 'Нет описания'
  elements.modalLink.href = post.link

  // Показываем модальное окно
  const modal = new Modal(elements.modal)
  modal.show()
}

const updateFeeds = (watchedState) => {
  if (watchedState.feeds.length === 0) {
    // Если нет фидов, планируем следующую проверку
    scheduleNextUpdate(watchedState)
    return
  }

  // console.log('Проверяем обновления RSS потоков...');

  const updatePromises = watchedState.feeds.map(feed =>
    fetchRSS(feed.url)
      .then((feedData) => {
        // Получаем существующие ссылки на посты для этого фида
        const existingPostLinks = watchedState.posts
          .filter(post => post.feedId === feed.id)
          .map(post => post.link)

        // Фильтруем только новые посты
        const newPosts = feedData.posts.filter(post =>
          !existingPostLinks.includes(post.link),
        )

        if (newPosts.length > 0) {
          // console.log(`Найдено ${newPosts.length} новых постов в фиде: ${feed.title}`);

          // Добавляем новые посты с привязкой к фиду
          const postsWithFeedId = newPosts.map(post => ({
            ...post,
            feedId: feed.id,
          }))

          // Добавляем новые посты в начало списка
          watchedState.posts.unshift(...postsWithFeedId)
        }

        return { success: true, feedUrl: feed.url }
      })
      .catch((error) => {
        // console.warn(`Ошибка обновления фида ${feed.url}:`, error.message);
        return { success: false, feedUrl: feed.url, error: error.message }
      }),
  )

  // Ждем завершения всех запросов, затем планируем следующую проверку
  Promise.all(updatePromises)
    .then(() => {
      // const successCount = results.filter(r => r.success).length;
      // const errorCount = results.filter(r => !r.success).length;

      // console.log(`Обновление завершено: ${successCount} успешно, ${errorCount} ошибок`);

      // Планируем следующую проверку только после завершения текущей
      scheduleNextUpdate(watchedState)
    })
    .catch(() => {
      // console.error('Критическая ошибка при обновлении фидов:', error);
      // Даже при критической ошибке планируем следующую проверку
      scheduleNextUpdate(watchedState)
    })
}

const scheduleNextUpdate = (watchedState) => {
  // Очищаем предыдущий таймер если есть
  if (watchedState.updateTimer) {
    clearTimeout(watchedState.updateTimer)
    watchedState.updateTimer = null
  }

  // Планируем следующую проверку через 5 секунд
  watchedState.updateTimer = setTimeout(() => {
    updateFeeds(watchedState)
  }, 5000)
}

const startAutoUpdate = (watchedState) => {
  // console.log('Запускаем автоматическое обновление RSS потоков');
  // Запускаем первую проверку сразу, затем она будет повторяться каждые 5 сек
  scheduleNextUpdate(watchedState)
}

const stopAutoUpdate = (watchedState) => {
  if (watchedState.updateTimer) {
    clearTimeout(watchedState.updateTimer)
    watchedState.updateTimer = null
    // console.log('Автоматическое обновление остановлено');
  }
}

const handleFormSubmit = (watchedState) => {
  return (event) => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const url = formData.get('url').trim()

    watchedState.form.status = 'processing'

    const existingUrls = watchedState.feeds.map(feed => feed.url)

    validateUrl(url, existingUrls)
      .then((errorCode) => {
        if (errorCode) {
          watchedState.form.status = 'error'
          watchedState.form.error = errorCode
          return Promise.reject(new Error('validation_failed'))
        }

        // Реальная загрузка RSS
        return fetchRSS(url)
      })
      .then((feedData) => {
        // Добавляем фид
        watchedState.feeds.push({
          id: feedData.id,
          url: feedData.url,
          title: feedData.title,
          description: feedData.description,
        })

        // Добавляем посты с привязкой к фиду
        const postsWithFeedId = feedData.posts.map(post => ({
          ...post,
          feedId: feedData.id,
        }))

        watchedState.posts.unshift(...postsWithFeedId)
        watchedState.form.status = 'success'
        watchedState.form.error = null

        // Запускаем автообновление если это первый фид
        if (watchedState.feeds.length === 1) {
          startAutoUpdate(watchedState)
        }
      })
      .catch((error) => {
        // Не перезаписываем ошибки валидации
        if (error.message === 'validation_failed') {
          return // Ошибка валидации уже обработана
        }
        watchedState.form.status = 'error'
        watchedState.form.error = error.message || 'networkError'
      })
  }
}

const init = () => {
  // Состояние приложения - НЕ глобальное!
  const state = {
    form: {
      status: 'filling', // filling, processing, success, error
      error: null, // код ошибки вместо текста
    },
    feeds: [],
    posts: [],
    readPosts: new Set(), // Множество ID прочитанных постов
    modal: {
      postId: null, // ID поста для показа в модальном окне
    },
    updateTimer: null,
  }

  const elements = {
    form: document.getElementById('rss-form'),
    urlInput: document.getElementById('url-input'),
    feedback: document.getElementById('feedback'),
    submitButton: null, // будет инициализирован позже
    modal: null, // будет инициализирован позже
    modalTitle: null,
    modalDescription: null,
    modalLink: null,
  }

  // Инициализируем i18next
  return i18n.init().then(() => {
    // Инициализируем элементы после загрузки DOM
    elements.submitButton = document.getElementById('submit-button')
    elements.modal = document.getElementById('post-preview-modal')
    elements.modalTitle = document.getElementById('modal-post-title')
    elements.modalDescription = document.getElementById('modal-post-description')
    elements.modalLink = document.getElementById('modal-post-link')
    const view = createView(state, elements, i18n, (state, postId) => showPostPreview(state, postId, elements))
    const watchedState = onChange(state, (path) => {
      if (path.startsWith('form')) {
        view.renderForm()
      }
      if (path.startsWith('feeds')) {
        view.renderFeeds()
      }
      if (path.startsWith('posts') || path.startsWith('readPosts')) {
        view.renderPosts()
      }
    })

    elements.form.addEventListener('submit', handleFormSubmit(watchedState))

    // Устанавливаем фокус на поле ввода
    elements.urlInput.focus()

    // Устанавливаем переведенные атрибуты
    view.updateLabels()

    // Очищаем таймер при закрытии страницы
    window.addEventListener('beforeunload', () => {
      stopAutoUpdate(watchedState)
    })
  })
}

document.addEventListener('DOMContentLoaded', init)
