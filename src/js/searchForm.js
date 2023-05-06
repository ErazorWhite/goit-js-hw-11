import { PixabayAPI } from './fetchImages';
const api = new PixabayAPI();

import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({
  width: '280px',
  position: 'right-top',
  distance: '70px',
  opacity: 1,
  // ...
});

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('.search-form__input');
const galleryEl = document.querySelector('div.gallery');

function onSubmit(e) {
  e.preventDefault();

  const searchQuerry = searchInputEl.value.trim();
  if (!searchQuerry) {
    Notify.info('Try enter something in search box');
    return;
  }

  api.query = searchQuerry;
  api
    .getPicturesByQuerry()
    .then(pictures => {
      console.log(pictures);

      if (pictures.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      renderPhotoCardsMarkup(pictures.hits);
    })
    .catch(console.log);
}

function renderPhotoCardsMarkup(pictures) {
  const markup = pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
      }) => {
        return `<div class="photo-card">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy width="370"" />
                  <div class="info">
                    <p class="info-item">
                      <b>Likes</b>
                      ${likes}
                    </p>
                    <p class="info-item">
                      <b>Views</b>
                      ${views}
                    </p>
                    <p class="info-item">
                      <b>Comments</b>
                      ${comments}
                    </p>
                    <p class="info-item">
                      <b>Downloads</b>
                      ${downloads}
                    </p>
                  </div>
                </div>`;
      }
    )
    .join(``);
  galleryEl.innerHTML = markup;
}

searchFormEl.addEventListener('submit', onSubmit);
