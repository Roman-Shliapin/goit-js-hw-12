import { getImagesByQuery } from './js/pixabay-api';
import {
  clearGallery,
  createGallery,
  hideLoader,
  hideLoadMoreButton,
  showLoader,
  showLoadMoreButton,
} from './js/render-functions';
import axios from 'axios';
// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';


const form = document.querySelector('.form');
const input = form.querySelector('.form-input');
const loadMore = document.querySelector('.button');
loadMore.addEventListener('click', onclick);

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;
form.addEventListener('submit', handlerSubmit);

function handlerSubmit(event) {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Oops!',
      message: 'Please enter a search term',
      timeout: 3000,
      position: 'topRight',
    });
    return;
  }
  if (query !== currentQuery) {
    currentPage = 1;
    currentQuery = query;
    clearGallery();
  }

  showLoader();

  getImagesByQuery(currentQuery, currentPage)
    .then(data => {
      hideLoader();
      const { hits, totalHits: total } = data;
      totalHits = total;
      if (hits.length === 0) {
        iziToast.error({
          title: 'No results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          timeout: 4000,
          position: 'topRight',
        });
        hideLoadMoreButton();
        return;
      }

      createGallery(hits);
      showLoadMoreButton();
      form.reset();
    })
    .catch(error => {
        console.log(error);
         iziToast.error({
        title: 'Error',
        message: 'Failed to load more images. Please try again later.',
        timeout: 3000,
        position: 'topRight',
      });
    });
}

function onclick() {
  currentPage += 1;
  showLoader();

  getImagesByQuery(currentQuery, currentPage)
    .then(data => {
      hideLoader();
      const { hits } = data;
      if (hits.length === 0) {
        hideLoadMoreButton();
        iziToast.error({
          title: 'No results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          timeout: 3000,
          position: 'topRight',
        });
        return;
      }
      createGallery(hits);
      const firstCard = document.querySelector('.gallery-item');
      if (firstCard) {
        const cardHeight = firstCard.getBoundingClientRect().height;
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth'
        });
      }
      

      const loadedImages = document.querySelectorAll('.gallery-item').length;
      if (loadedImages >= totalHits) {
        hideLoadMoreButton();
        iziToast.info({
          title: 'End of results',
          message: "We're sorry, but you've reached the end of search results.",
          timeout: 3000,
          position: 'topRight',
        });
      }
    })
    .catch(error => {
      console.error(error);
    });
}
