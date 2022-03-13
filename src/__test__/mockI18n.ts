jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => undefined),
        languages: ['de', 'en'],
        language: 'en',
      },
    };
  },
}));
