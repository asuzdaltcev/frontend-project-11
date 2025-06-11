// en.js - English localization example
export const en = {
  translation: {
    // Main interface texts
    appTitle: 'RSS Reader',
    appDescription: 'Add and read RSS feeds',
    urlLabel: 'RSS Feed URL',
    urlPlaceholder: 'https://example.com/rss',
    urlExample: 'Example: https://lorem-rss.herokuapp.com/feed',
    addButton: 'Add',
    loadingButton: 'Loading...',

    // Section titles
    feedsTitle: 'Feeds',
    postsTitle: 'Posts',
    feedsCount: 'Feeds ({{count}})',
    postsCount: 'Posts ({{count}})',

    // Default names
    noTitle: 'No title',
    noDescription: 'No description',
    readButton: 'Read',

    // Success messages
    success: {
      feedAdded: 'RSS feed successfully added!',
    },

    // Error codes
    errors: {
      required: 'URL cannot be empty',
      invalidUrl: 'Link must be a valid URL',
      duplicate: 'RSS feed already exists',
      validationError: 'Validation error occurred',
      networkError: 'Network error. Please check your internet connection and try again.',
      invalidRSS: 'The resource does not contain valid RSS',
    }
  }
}
