import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Note: Paths changed to ./js/ because main.js is inside src now
import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  showEndMessage,
  hideEndMessage,
} from './js/render-functions.js';

const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const query = form.elements.query.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  hideLoadMoreButton();
  hideEndMessage();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    if (currentPage * 15 < totalHits) {
      showLoadMoreButton();
    } else {
      showEndMessage();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    const firstCard = document.querySelector('.gallery-item');
    if (firstCard) {
      const cardHeight = firstCard.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      showEndMessage();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});