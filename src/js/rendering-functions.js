import galleryItems from '../templates/gallery-items.hbs';
import { galleryEl, loadMoreBtn } from '../index';

function addImgsToGallery(arrayOfImgs) {
  galleryEl.insertAdjacentHTML('beforeend', galleryItems(arrayOfImgs));
}

function clearGallery() {
  galleryEl.innerHTML = '';
}

function scrollToStart() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function scrollToStartVP() {
  window.scrollBy({
    top: window.innerHeight - 140,
    behavior: 'smooth',
  });
}

function hideBtnLoadMore() {
  loadMoreBtn.style.display = 'none';
}

function showBtnLoadMore() {
  loadMoreBtn.style.display = 'block';
}

export {
  addImgsToGallery,
  clearGallery,
  scrollToStart,
  scrollToStartVP,
  hideBtnLoadMore,
  showBtnLoadMore,
};
