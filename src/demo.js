// demo.js - тестовые сценарии для валидации
import { validateUrl } from './validation.js';
import i18n from './i18n.js';

const testCases = [
  {
    url: '',
    existing: [],
    expected: 'required',
    description: 'Пустой URL'
  },
  {
    url: 'not-a-url',
    existing: [],
    expected: 'invalidUrl',
    description: 'Невалидный URL'
  },
  {
    url: 'https://example.com/feed',
    existing: [],
    expected: null,
    description: 'Валидный URL'
  },
  {
    url: 'https://example.com/feed',
    existing: ['https://example.com/feed'],
    expected: 'duplicate',
    description: 'Дублирующийся URL'
  },
  {
    url: 'https://another-example.com/rss',
    existing: ['https://example.com/feed'],
    expected: null,
    description: 'Новый валидный URL'
  }
];

export const runTests = () => {
  console.log('🧪 Запуск тестов валидации...\n');
  
  const promises = testCases.map((testCase, index) => {
    return validateUrl(testCase.url, testCase.existing)
      .then((result) => {
        const passed = result === testCase.expected;
        const status = passed ? '✅' : '❌';
        const expectedText = testCase.expected ? i18n.t(`errors.${testCase.expected}`) : 'null';
        const resultText = result ? i18n.t(`errors.${result}`) : 'null';
        
        console.log(`${status} Тест ${index + 1}: ${testCase.description}`);
        console.log(`   URL: "${testCase.url}"`);
        console.log(`   Ожидалось: ${expectedText} (код: ${testCase.expected || 'null'})`);
        console.log(`   Получено: ${resultText} (код: ${result || 'null'})`);
        console.log('');
        return passed;
      });
  });

  return Promise.all(promises)
    .then((results) => {
      const passed = results.filter(Boolean).length;
      const total = results.length;
      console.log(`📊 Результаты: ${passed}/${total} тестов прошли`);
      
      if (passed === total) {
        console.log('🎉 Все тесты прошли успешно!');
      } else {
        console.log('⚠️  Некоторые тесты не прошли');
      }
    });
}; 