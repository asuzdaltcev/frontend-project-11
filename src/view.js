export default (state, elements, i18n, showPostPreview) => {
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

    // Обновляем тексты модального окна
    const modalTitle = document.getElementById('post-preview-modal-label');
    if (modalTitle) {
      modalTitle.textContent = i18n.t('modal.previewTitle');
    }

    const modalReadFullText = document.getElementById('modal-read-full-text');
    if (modalReadFullText) {
      modalReadFullText.textContent = i18n.t('modal.readFullArticle');
    }

    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.textContent = i18n.t('modal.close');
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

    // Индикатор автоматического обновления
    const updateIndicator = state.feeds.length > 0 ? `
      <small class="text-muted ms-2">
        <i class="bi bi-arrow-clockwise me-1"></i>
        Автообновление каждые 5 сек
      </small>
    ` : '';

    feedsContainer.innerHTML = `
      <div class="card">
        <div class="card-header bg-light d-flex justify-content-between align-items-center">
          <h2 class="h5 mb-0 text-secondary">
            <i class="bi bi-collection me-2"></i>
            ${i18n.t('feedsCount', { count: state.feeds.length })}
          </h2>
          ${updateIndicator}
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

    const postsHtml = state.posts.map(post => {
      const isRead = state.readPosts.has(post.id);
      const titleClass = isRead ? 'fw-normal' : 'fw-bold';
      
      return `
        <li class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="${titleClass}">
              <a href="${post.link}" class="text-decoration-none post-link" target="_blank" rel="noopener noreferrer">
                ${post.title || i18n.t('noTitle')}
              </a>
            </div>
            ${post.description ? `<small class="text-muted">${post.description}</small>` : ''}
          </div>
          <div class="btn-group" role="group">
            <button 
              type="button" 
              class="btn btn-sm btn-outline-primary preview-btn" 
              data-post-id="${post.id}"
              title="${i18n.t('modal.preview')}"
            >
              <i class="bi bi-eye"></i>
            </button>
            <a href="${post.link}" class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener noreferrer" title="${i18n.t('modal.openArticle')}">
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </div>
        </li>
      `;
    }).join('');

    postsContainer.innerHTML = `
      <div class="card">
        <div class="card-header bg-light">
          <h2 class="h5 mb-0 text-secondary">
            <i class="bi bi-journal-text me-2"></i>
            ${i18n.t('postsCount', { count: state.posts.length })}
          </h2>
        </div>
        <div class="card-body p-0">
          <ul class="list-group list-group-flush">
            ${postsHtml}
          </ul>
        </div>
      </div>
    `;

    // Добавляем обработчики событий для кнопок предпросмотра
    const previewButtons = postsContainer.querySelectorAll('.preview-btn');
    previewButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const postId = button.getAttribute('data-post-id');
        showPostPreview(state, postId);
      });
    });
  };

  return {
    renderForm,
    renderFeeds,
    renderPosts,
    updateLabels,
  };
}; 