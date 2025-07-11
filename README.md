# RSS агрегатор

[![Actions Status](https://github.com/asuzdaltcev/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/asuzdaltcev/frontend-project-11/actions)
[![CI](https://github.com/asuzdaltcev/frontend-project-11/actions/workflows/ci.yml/badge.svg)](https://github.com/asuzdaltcev/frontend-project-11/actions)

Приложение для чтения RSS-потоков с автоматическим обновлением.

## 🚀 Демо

Проект задеплоен на Vercel: [https://frontend-project-11-sand-two.vercel.app](https://frontend-project-11-sand-two.vercel.app)

## Функциональность

✅ **Добавление RSS потоков** - Добавляйте RSS каналы по URL  
✅ **Валидация URL** - Проверка корректности введенных адресов  
✅ **Парсинг RSS** - Автоматическое извлечение данных из RSS потоков  
✅ **Отображение фидов** - Показ заголовков и описаний каналов  
✅ **Список постов** - Посты отображаются как ссылки на оригинальные статьи  
✅ **Автообновление** - Новые посты загружаются каждые 5 секунд  
✅ **Обработка ошибок** - Корректная обработка сетевых ошибок и некорректных RSS  
✅ **Обход CORS** - Использование AllOrigins прокси для загрузки RSS  
✅ **Интернационализация** - Поддержка русского и английского языков  
✅ **Адаптивный дизайн** - Работает на всех устройствах  

## Демонстрация

Попробуйте добавить следующие RSS каналы:
- https://lorem-rss.herokuapp.com/feed
- https://ru.hexlet.io/lessons.rss  
- https://feeds.feedburner.com/reuters/topNews

## Технологии

- **Vanilla JavaScript** - Основной язык разработки
- **Axios** - HTTP клиент для загрузки RSS
- **DOMParser** - Парсинг XML данных RSS
- **on-change** - Реактивное управление состоянием
- **i18next** - Интернационализация
- **Bootstrap 5** - CSS фреймворк и иконки
- **Vite** - Сборщик и dev-сервер

## Установка и запуск

1. Клонируйте репозиторий
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
4. Откройте браузер по адресу http://localhost:5173

## Структура проекта

```
src/
├── main.js          # Основная логика приложения
├── rss.js          # Модуль для работы с RSS (загрузка и парсинг)
├── view.js         # Модуль отображения (View)
├── validation.js   # Валидация URL
├── i18n.js        # Настройка интернационализации
├── styles.css     # Пользовательские стили
└── locales/       # Файлы переводов
    ├── ru.js      # Русский язык
    └── en.js      # Английский язык
```

## Особенности реализации

### Архитектура
- **MVC паттерн** - Разделение логики, представления и данных
- **Реактивное управление состоянием** - Использование on-change для отслеживания изменений
- **Модульная структура** - Каждая функциональность вынесена в отдельный модуль

### Парсинг RSS
- Чистая функция `parseRSS()` для извлечения данных из RSS XML
- Корректная обработка отсутствующих элементов
- Генерация уникальных ID для фидов и постов

### Обработка ошибок
- Различные типы ошибок: сетевые, парсинга, валидации
- Пользовательские сообщения об ошибках
- Таймауты для HTTP запросов

### Производительность
- Автоматическое обновление только новых постов
- Предотвращение дублирования постов
- Эффективное управление таймерами

## Команды сборки

```bash
npm run dev      # Запуск dev-сервера
npm run build    # Сборка для продакшена
npm run preview  # Превью продакшен сборки
npm run lint     # Проверка кода ESLint
```

---

**Hexlet Frontend Project #11**
