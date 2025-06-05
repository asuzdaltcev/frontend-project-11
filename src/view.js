export default (state, elements, i18n) => {
  const { form, urlInput, feedback, submitButton } = elements;

  const clearValidationClasses = () => {
    urlInput.classList.remove('is-invalid', 'is-valid');
  };

  const updateLabels = () => {
    // Обновляем атрибуты и тексты с переводами
    const urlLabel = document.querySelector('label[for="url-input"]');
    if (urlLabel) {
      urlLabel.textContent = i18n.t('urlLabel');
    }
    
    urlInput.placeholder = i18n.t('urlPlaceholder');
    
    const urlHelp = document.getElementById('url-help');
    if (urlHelp) {
      urlHelp.textContent = i18n.t('urlExample');
    }
    
    const appTitle = document.querySelector('h1');
    if (appTitle) {
      appTitle.innerHTML = `
        <i class="bi bi-rss-fill me-2"></i>
        ${i18n.t('appTitle')}
      `;
    }
    
    const appDescription = document.querySelector('.card-header p');
    if (appDescription) {
      appDescription.textContent = i18n.t('appDescription');
    }
  };

  const renderForm = () => {
    const buttonText = submitButton.querySelector('.button-text');
    const spinner = submitButton.querySelector('.loading-spinner');

    if (state.form.status === 'filling') {
      urlInput.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
      clearValidationClasses();
      feedback.innerHTML = '';
      buttonText.textContent = i18n.t('addButton');
      spinner.classList.add('d-none');
    }

    if (state.form.status === 'processing') {
      urlInput.setAttribute('disabled', 'disabled');
      submitButton.setAttribute('disabled', 'disabled');
      clearValidationClasses();
      feedback.innerHTML = '';
      buttonText.textContent = i18n.t('loadingButton');
      spinner.classList.remove('d-none');
    }

    if (state.form.status === 'success') {
      urlInput.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
      clearValidationClasses();
      urlInput.classList.add('is-valid');
      feedback.innerHTML = `<div class="alert alert-success d-flex align-items-center"><i class="bi bi-check-circle-fill me-2"></i>${i18n.t('success.feedAdded')}</div>`;
      form.reset();
      // Убираем класс is-valid после сброса формы
      setTimeout(() => clearValidationClasses(), 100);
      urlInput.focus();
      buttonText.textContent = i18n.t('addButton');
      spinner.classList.add('d-none');
    }

    if (state.form.status === 'error') {
      urlInput.removeAttribute('disabled');
      submitButton.removeAttribute('disabled');
      clearValidationClasses();
      urlInput.classList.add('is-invalid');
      const errorMessage = i18n.t(`errors.${state.form.error}`);
      feedback.innerHTML = `<div class="alert alert-danger d-flex align-items-center"><i class="bi bi-exclamation-triangle-fill me-2"></i>${errorMessage}</div>`;
      urlInput.focus();
      buttonText.textContent = i18n.t('addButton');
      spinner.classList.add('d-none');
    }
  };

  const renderFeeds = () => {
    const feedsContainer = document.getElementById('feeds');
    if (state.feeds.length === 0) {
      feedsContainer.innerHTML = '';
      return;
    }

    const feedsHtml = state.feeds.map(feed => `
      <div class="card mb-3 feed-item">
        <div class="card-body">
          <h5 class="card-title text-primary">${feed.title || i18n.t('noTitle')}</h5>
          <p class="card-text text-muted">${feed.description || i18n.t('noDescription')}</p>
          <small class="text-secondary">
            <i class="bi bi-link-45deg me-1"></i>
            ${feed.url}
          </small>
        </div>
      </div>
    `).join('');

    feedsContainer.innerHTML = `
      <div class="card">
        <div class="card-header bg-light">
          <h2 class="h5 mb-0 text-secondary">
            <i class="bi bi-collection me-2"></i>
            ${i18n.t('feedsCount', { count: state.feeds.length })}
          </h2>
        </div>
        <div class="card-body">
          ${feedsHtml}
        </div>
      </div>
    `;
  };

  const renderPosts = () => {
    const postsContainer = document.getElementById('posts');
    if (state.posts.length === 0) {
      postsContainer.innerHTML = '';
      return;
    }

    const postsHtml = state.posts.map(post => `
      <div class="card mb-3">
        <div class="card-body">
          <h6 class="card-title">${post.title || i18n.t('noTitle')}</h6>
          <p class="card-text text-muted">${post.description || i18n.t('noDescription')}</p>
          <a href="${post.link}" class="btn btn-sm btn-outline-primary post-link" target="_blank" rel="noopener noreferrer">
            <i class="bi bi-box-arrow-up-right me-1"></i>
            ${i18n.t('readButton')}
          </a>
        </div>
      </div>
    `).join('');

    postsContainer.innerHTML = `
      <div class="card">
        <div class="card-header bg-light">
          <h2 class="h5 mb-0 text-secondary">
            <i class="bi bi-journal-text me-2"></i>
            ${i18n.t('postsCount', { count: state.posts.length })}
          </h2>
        </div>
        <div class="card-body">
          ${postsHtml}
        </div>
      </div>
    `;
  };

  return {
    renderForm,
    renderFeeds,
    renderPosts,
    updateLabels,
  };
}; 