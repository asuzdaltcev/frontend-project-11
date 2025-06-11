// validation.js
import * as yup from 'yup';

// Настройка локализации yup
yup.setLocale({
  mixed: {
    required: () => ({ code: 'required' }),
  },
  string: {
    url: () => ({ code: 'invalidUrl' }),
  },
});

export const createValidationSchema = (existingUrls) => {
  return yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .test('not-duplicate', () => ({ code: 'duplicate' }), (value) => {
        return !existingUrls.includes(value);
      }),
  });
};

export const validateUrl = (url, existingUrls) => {
  const schema = createValidationSchema(existingUrls);
  return schema.validate({ url })
    .then(() => null) // нет ошибок
    .catch((error) => {
      
      // Проверяем тип ошибки
      if (error.type === 'not-duplicate') {
        return 'duplicate';
      }
      
      if (error.type === 'url') {
        return 'invalidUrl';
      }
      
      if (error.type === 'required') {
        return 'required';
      }
      
      // Возвращаем код ошибки из params
      if (error.inner && error.inner.length > 0) {
        const innerError = error.inner[0];
        
        if (innerError.type === 'not-duplicate') {
          return 'duplicate';
        }
        
        if (innerError.type === 'url') {
          return 'invalidUrl';
        }
        
        if (innerError.type === 'required') {
          return 'required';
        }
        
        return innerError.params?.code || 'validationError';
      }
      
      return error.params?.code || 'validationError';
    });
}; 