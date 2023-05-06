// Your API key: 36098087-1a56f41df652eefc24b37e33b

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #query = '';

  getPicturesByQuerry() {
    const params = new URLSearchParams({
        key: '36098087-1a56f41df652eefc24b37e33b',
        q: this.#query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
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
}
