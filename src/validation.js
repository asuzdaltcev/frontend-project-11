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
      // Возвращаем код ошибки вместо текста
      if (error.inner && error.inner.length > 0) {
        return error.inner[0].params?.code || 'validationError';
      }
      return error.params?.code || 'validationError';
    });
}; 