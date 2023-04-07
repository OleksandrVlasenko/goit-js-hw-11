import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { successMsg, warningMsg, failureMsg } from './js/alert-message.js';
import { getImgs, options } from './js/pixabay-request';
import {
  addImgsToGallery,
  clearGallery,
  scrollToStart,
  scrollToStartVP,
  hideBtnLoadMore,
  showBtnLoadMore,
} from './js/rendering-functions.js';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const sentinel = document.querySelector('#sentinel');

export { galleryEl, loadMoreBtn };

let countOfImg = 0;

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

const observer = new IntersectionObserver(onObserve, {
  rootMargin: '250px',
});

form.addEventListener('submit', onSearchImgs);

loadMoreBtn.addEventListener('click', onLoadMoreImgs);

async function onSearchImgs(e) {
  e.preventDefault();

  observer.unobserve(sentinel);

  scrollToStart();

  hideBtnLoadMore();

  options.params.q = form.elements.searchQuery.value.trim();
  options.params.page = 1;
  countOfImg = 0;

  if (options.params.q === '') {
    warningMsg('The field must not be empty');
    form.elements.searchQuery.value = '';
    return;
  }

  try {
    const {
      data: { hits, totalHits },
    } = await getImgs();

    if (hits.length === 0) {
      clearGallery();

      failureMsg(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    successMsg(`Hooray! We found ${totalHits} images.`);

    clearGallery();

    addImgsToGallery(hits);

    if (form.elements.methodOfScroll.value === 'with-infinity-scroll') {
      observer.observe(sentinel);
    } else {
      showBtnLoadMore();
    }

    addCountOfImgs(hits, totalHits);

    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMoreImgs() {
  try {
    options.params.page += 1;

    const {
      data: { hits, totalHits },
    } = await getImgs();

    addImgsToGallery(hits);

    if (form.elements.methodOfScroll.value === 'with-btn-load-more') {
      scrollToStartVP();
    }

    addCountOfImgs(hits, totalHits);

    lightbox.refresh();
  } catch (error) {
    console.error(error);
  }
}

function onObserve(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMoreImgs();
    }
  });
}

function addCountOfImgs(hits, totalHits) {
  countOfImg += hits.length;

  if (countOfImg === totalHits) {
    hideBtnLoadMore();

    observer.unobserve(sentinel);

    warningMsg("We're sorry, but you've reached the end of search results.");
  }
}
