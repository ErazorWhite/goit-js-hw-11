import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox = null;

import { PixabayAPI } from './fetchImages';
const api = new PixabayAPI();

import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.init({
  width: '280px',
  position: 'right-top',
  distance: '70px',
  opacity: 1,
});

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
let observer = new IntersectionObserver(onPagination, options);

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('.search-form__input');
const galleryEl = document.querySelector('div.gallery');
const guardEl = document.querySelector('.js-guard');

function onSubmit(e) {
  e.preventDefault();

  const searchQuerry = searchInputEl.value.trim();
  if (!searchQuerry) {
    Notify.info('Try enter something in search box');
    return;
  }

  removePhotoCardsMarkup();

  api.query = searchQuerry;
  api.resetPage();
  api
    .getPicturesByQuerry()
    .then(pictures => {
      if (pictures.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
      renderPhotoCardsMarkup(pictures.hits);
      observer.observe(guardEl);
      enableSimpleLightBox();
      showLoadMoreBtn();
    })
    .catch(console.log);
}

function onPagination(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      api.nextPage();
      api
        .getPicturesByQuerry()
        .then(pictures => {
          if (pictures.hits.length === 0) {
            Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
            return;
          }

          renderPhotoCardsMarkup(pictures.hits);
          smoothScroll();
          lightbox.refresh(); // Destroys and reinitilized the lightbox, needed for eg. Ajax Calls, or after dom manipulations
        })
        .catch(console.log);
    }
  });
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
        downloads,
      }) => {
        return `
              <a href="${largeImageURL}" class="photo-link">
                <div class="photo-card">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy width="370" hight="200"" />
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
                </div>
              </a>
                `;
      }
    )
    .join(``);
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function smoothScroll() {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}

function removePhotoCardsMarkup() {
  galleryEl.innerHTML = '';
}

function enableSimpleLightBox() {
  lightbox = new SimpleLightbox('.gallery a', {
    captions: true, // Включаем подписи
    captionPosition: 'bottom', // Внизу
    captionDelay: 250, // Появляются через 250мс
    captionsData: 'alt', // Текст берут из img alt атрибута
  });
}

searchFormEl.addEventListener('submit', onSubmit);

// Знаю, что оставлять мусор плохо, но для себя тут сделаю шпаргалку по Load more кнопке
// const loadMoreEl = document.querySelector('.load-more');
// function onLoadMore() {
//   hideLoadMoreBtn();
//   api.nextPage();
//   api
//     .getPicturesByQuerry()
//     .then(pictures => {
//       if (pictures.hits.length === 0) {
//         Notify.failure(
//           "We're sorry, but you've reached the end of search results."
//         );
//         return;
//       }

//       renderPhotoCardsMarkup(pictures.hits);
//       smoothScroll();
//       lightbox.refresh(); // Destroys and reinitilized the lightbox, needed for eg. Ajax Calls, or after dom manipulations
//       showLoadMoreBtn();
//     })
//     .catch(console.log);
// }
// function showLoadMoreBtn() {
//   loadMoreEl.classList.remove('load-more-isHidden');
// }
// function hideLoadMoreBtn() {
//   loadMoreEl.classList.add('load-more-isHidden');
// }
// loadMoreEl.addEventListener('click', onLoadMore);
