# 🌍 Руководство по интернационализации

## Обзор

Проект использует **i18next** для управления всеми текстами интерфейса. Это обеспечивает:

- 🎯 Централизованное управление текстами
- 🌍 Легкое добавление новых языков  
- 📝 Чистое разделение логики и представления
- 🔧 Удобство поддержки и обновления

## Архитектура

### 1. Конфигурация i18next (`src/i18n.js`)

```javascript
const resources = {
  ru: {
    translation: {
      appTitle: 'RSS Reader',
      errors: {
        required: 'URL не может быть пустым',
        invalidUrl: 'Ссылка должна быть валидным URL'
      }
    }
  }
};
```

### 2. Коды ошибок в состоянии

**❌ Раньше (плохо):**
```javascript
state.form.error = "URL не может быть пустым";
```

**✅ Теперь (хорошо):**
```javascript
state.form.error = "required";
// Отображение: i18n.t(`errors.${state.form.error}`)
```

### 3. Локализация yup

```javascript
yup.setLocale({
  mixed: {
    required: () => ({ code: 'required' }),
  },
  string: {
    url: () => ({ code: 'invalidUrl' }),
  },
});
```

## Использование в компонентах

### В View слое

```javascript
// Простой перевод
buttonText.textContent = i18n.t('addButton');

// Перевод с параметрами
title.textContent = i18n.t('feedsCount', { count: feeds.length });

// Перевод ошибок по коду
const errorMessage = i18n.t(`errors.${errorCode}`);
```

### В главном файле

```javascript
const init = () => {
  return i18n.init().then(() => {
    // Инициализация приложения после загрузки переводов
    const view = createView(state, elements, i18n);
    view.updateLabels(); // Обновление всех текстов
  });
};
```

## Добавление нового языка

### Шаг 1: Создайте файл локализации

```javascript
// src/locales/en.js
export const en = {
  translation: {
    appTitle: 'RSS Reader',
    urlLabel: 'RSS Feed URL',
    addButton: 'Add',
    errors: {
      required: 'URL cannot be empty',
      invalidUrl: 'Link must be a valid URL'
    }
  }
};
```

### Шаг 2: Добавьте в конфигурацию

```javascript
// src/i18n.js
import { en } from './locales/en.js';

const resources = {
  ru: { translation: { /* русские переводы */ } },
  en: en
};
```

### Шаг 3: Добавьте переключатель языка (опционально)

```javascript
// Переключение языка
i18next.changeLanguage('en').then(() => {
  view.updateLabels();
  view.renderForm();
});
```

## Структура переводов

```
translation: {
  // Основной интерфейс
  appTitle: 'RSS Reader',
  urlLabel: 'URL RSS-потока',
  addButton: 'Добавить',
  
  // Сообщения
  success: {
    feedAdded: 'RSS поток успешно добавлен!'
  },
  
  // Коды ошибок (ключевая особенность)
  errors: {
    required: 'URL не может быть пустым',
    invalidUrl: 'Ссылка должна быть валидным URL',
    duplicate: 'RSS поток уже существует'
  }
}
```

## Тестирование

### В консоли браузера:

```javascript
// Проверить текущий язык
console.log(window.i18next?.language);

// Получить перевод
console.log(window.i18next?.t('addButton'));

// Получить перевод ошибки
console.log(window.i18next?.t('errors.required'));
```

### Автоматические тесты:

```javascript
// src/demo.js уже обновлен для работы с кодами ошибок
import('./src/demo.js').then(module => module.runTests());
```

## Преимущества архитектуры

1. **🎯 Разделение ответственности**: Состояние хранит логические коды, View отображает тексты
2. **🌍 Масштабируемость**: Добавление языка не требует изменения логики
3. **🔧 Поддержка**: Все тексты в одном месте, легко найти и изменить
4. **✅ Последовательность**: Одинаковый подход для всех текстов приложения

## Файлы для изучения

- `src/i18n.js` - конфигурация и ресурсы
- `src/locales/en.js` - пример дополнительного языка
- `src/view.js` - использование переводов в UI
- `src/validation.js` - локализация yup
- `i18n-demo.html` - демо страница с примерами 