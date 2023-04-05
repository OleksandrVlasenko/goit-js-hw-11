import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'notiflix/dist/notiflix-3.2.6.min.js';
import galleryItems from '../templates/gallery-items.hbs';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const sentinel = document.querySelector('#sentinel');

let countOfImg = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const observer = new IntersectionObserver(callback, { rootMargin: '200px' });
observer.observe(sentinel);

const AUTH_KEY = '35003886-1d9d7f8458bd91da816cc357a';
const BASE_URL = 'https://pixabay.com/api/';

const options = {
  params: {
    key: AUTH_KEY,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
  },
};

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 1000;

form.addEventListener('submit', onSearchImgs);

function onSearchImgs(e) {
  e.preventDefault();

  scrollToStart()

  options.params.q = form.elements.searchQuery.value.trim();
  options.params.page = 1;
  countOfImg = 0;

  try {
    getImg(options).then(r => {
      if (r.data.hits.length === 0) {
        clearGallery();

        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notiflix.Notify.success(`Hooray! We found ${r.data.totalHits} images.`);

      clearGallery();

      addImgsToGallery(r.data.hits);

      addCountOfImgs(r.data);

      lightbox.refresh();
    });
  } catch (error) {
    console.error(error);
  }
}

function onLoadMoreImgs() {
  try {
    options.params.page += 1;

    getImg(options).then(r => {
      addImgsToGallery(r.data.hits);

      addCountOfImgs(r.data);

      lightbox.refresh();
    });
  } catch (error) {
    console.error(error);
  }
}

async function getImg(options) {
  return await axios.request(options);
}

function addCountOfImgs(data) {
  if (countOfImg === data.totalHits) {
    // loadMoreBtn.style.display = 'none';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }

  countOfImg += data.hits.length;
}

function addImgsToGallery(arrayOfImgs) {
  galleryEl.insertAdjacentHTML('beforeend', galleryItems(arrayOfImgs));
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function callback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting && galleryEl.innerHTML !== '') {
      onLoadMoreImgs();
    }
  });
}

function scrollToStart() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
