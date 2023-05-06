// Your API key: 36098087-1a56f41df652eefc24b37e33b

export class PixabayAPI {
  constructor(initPage = 1, initPerPage = 40) {
    this.#curPage = initPage;
    this.perPage = initPerPage;
  }

  #BASE_URL = 'https://pixabay.com/api/';
  #query = '';
  #curPage = 1;
  #perPage = 40;

  getPicturesByQuerry() {
    const params = new URLSearchParams({
      key: '36098087-1a56f41df652eefc24b37e33b',
      q: this.#query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.#curPage,
      per_page: this.#perPage,
    });
    const url = `${this.#BASE_URL}?${params}`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  set page(newPage) {
    this.#curPage = newPage;
  }
  get page() {
    return this.#curPage;
  }

  set perPage(newPerPage) {
    this.#perPage = newPerPage;
  }
  get perPage() {
    return this.#perPage;
  }

  nextPage() {
    this.#curPage++;
  }
  resetPage() {
    this.#curPage = 1;
  }
}
