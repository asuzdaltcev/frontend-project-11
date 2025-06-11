import axios from 'axios'

const ALL_ORIGINS_PROXY = 'https://allorigins.hexlet.app/get?disableCache=true&url='

const generateId = () => Math.random().toString(36).substr(2, 9)

const parseRSS = (rssText) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(rssText, 'text/xml')

  // Проверяем на ошибки парсинга
  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    throw new Error('invalidRSS')
  }

  // Ищем элемент channel
  const channel = doc.querySelector('channel')
  if (!channel) {
    throw new Error('invalidRSS')
  }

  // Извлекаем данные фида
  const titleElement = channel.querySelector('title')
  const descriptionElement = channel.querySelector('description')

  const feed = {
    title: titleElement ? titleElement.textContent.trim() : '',
    description: descriptionElement ? descriptionElement.textContent.trim() : '',
  }

  // Извлекаем посты
  const items = channel.querySelectorAll('item')
  const posts = Array.from(items).map((item) => {
    const titleEl = item.querySelector('title')
    const descriptionEl = item.querySelector('description')
    const linkEl = item.querySelector('link')
    const pubDateEl = item.querySelector('pubDate')

    return {
      id: generateId(),
      title: titleEl ? titleEl.textContent.trim() : '',
      description: descriptionEl ? descriptionEl.textContent.trim() : '',
      link: linkEl ? linkEl.textContent.trim() : '',
      pubDate: pubDateEl ? pubDateEl.textContent.trim() : '',
    }
  })

  return { feed, posts }
}

const fetchRSS = async (url) => {
  try {
    const proxyUrl = `${ALL_ORIGINS_PROXY}${encodeURIComponent(url)}`
    const response = await axios.get(proxyUrl, {
      timeout: 10000, // 10 секунд таймаут
    })

    if (!response.data.contents) {
      throw new Error('networkError')
    }

    const { feed, posts } = parseRSS(response.data.contents)

    return {
      id: generateId(),
      url,
      title: feed.title,
      description: feed.description,
      posts,
    }
  }
  catch (error) {
    // Обрабатываем различные типы ошибок
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('networkError')
    }

    if (error.message === 'invalidRSS' || error.message === 'networkError') {
      throw error
    }

    if (error.response) {
      // HTTP ошибка
      throw new Error('networkError')
    }

    // Другие ошибки сети
    throw new Error('networkError')
  }
}

export { fetchRSS, parseRSS }
