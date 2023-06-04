import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import "simplelightbox/dist/simple-lightbox.min.css";
import searchImages from './api.js';

let currentPage = 1;
let currentSearchQuery = '';
let lightbox;

const loadMoreButton = document.querySelector('.load-more');
loadMoreButton.style.display = 'none'; // Приховуємо кнопку на початку

function createMarkup(images) {
    return images
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
            `<div class="photo-card">
            <a class="gallery__link" href="${largeImageURL}">
                <img class="img-card" src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}"/>
            </a>
            <div class="info">
                <p class="info-item">
                    <b class="bb">Likes<span class="span-opt">${likes}</span></b>
                </p>
                <p class="info-item">
                    <b class="bb">Views<span class="span-opt">${views}</span></b>
                </p>
                <p class="info-item">
                    <b class="bb">Comments<span class="span-opt">${comments}</span></b>
                </p>
                <p class="info-item">
                    <b class="bb">Downloads<span class="span-opt">${downloads}</span></b>
                </p> 
            </div>
        </div>`
        )
        .join('');
}

function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const searchQuery = form.searchQuery.value.trim();

    if (searchQuery !== '') {
        currentSearchQuery = searchQuery;
        currentPage = 1;
        loadMoreButton.style.display = 'none'; // Ховаємо кнопку перед новим запитом
        performSearch(searchQuery);
    }
}

async function performSearch(searchQuery) {
    const { images, totalHits } = await searchImages(searchQuery, currentPage);

    const galleryElement = document.querySelector('.gallery');
    if (images.length === 0) {
        galleryElement.innerHTML = ''; // Очищуємо галерею, якщо немає результатів
    } else {
        const markup = createMarkup(images);
        if (currentPage === 1) {
            galleryElement.innerHTML = markup; // Перших 40 картинок
        } else {
            galleryElement.innerHTML += markup; // Наступні 40 картинок
        }

        if (images.length === 40) {
            loadMoreButton.style.display = 'block'; // Показуємо кнопку, якщо є ще картинки
        } else {
            loadMoreButton.style.display = 'none'; // Ховаємо кнопку, якщо картинок немає
        }

        if (currentPage * 40 >= totalHits) {
            loadMoreButton.style.display = 'none'; // Ховаємо кнопку, якщо дійшли до кінця колекції
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`); // Повідомлення з кількістю знайдених зображень

        initializeLightbox(); // Ініціалізуємо SimpleLightbox для нових карток зображень
    }
}

function loadMoreImages() {
    currentPage += 1;
    performSearch(currentSearchQuery);
}

function initializeLightbox() {
    if (lightbox) {
        lightbox.refresh(); // Оновлюємо SimpleLightbox для нових карток зображень
    } else {
        lightbox = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
        });
    }
}

const formElement = document.getElementById('search-form');
formElement.addEventListener('submit', handleSubmit);

loadMoreButton.addEventListener('click', loadMoreImages);











// import axios from 'axios';
// import Notiflix from 'notiflix';
// import SimpleLightbox from 'simplelightbox';

// import "simplelightbox/dist/simple-lightbox.min.css";

// let currentPage = 1;
// let currentSearchQuery = '';
// let lightbox;

// const loadMoreButton = document.querySelector('.load-more');
// loadMoreButton.style.display = 'none'; // Приховуємо кнопку на початку

// async function searchImages(searchQuery) {
//     const API_KEY = '37016805-d1d678301f08548020cdd855a';

//     const params = {
//         key: API_KEY,
//         q: searchQuery,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         per_page: 40,
//         page: currentPage,
//     };

//     try {
//         const response = await axios.get('https://pixabay.com/api/', { params });
//         const { hits, totalHits } = response.data;
//         const images = hits;

//         if (images.length === 0) {
//             Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//         } else {
//             const markup = createMarkup(images);
//             const galleryElement = document.querySelector('.gallery');
//             if (currentPage === 1) {
//                 galleryElement.innerHTML = markup; // Перших 40 картинок
//             } else {
//                 galleryElement.innerHTML += markup; // Наступні 40 картинок
//             }

//             if (images.length === 40) {
//                 loadMoreButton.style.display = 'block'; // Показуємо кнопку, якщо є ще картинки
//             } else {
//                 loadMoreButton.style.display = 'none'; // Ховаємо кнопку, якщо картинок немає
//             }

//             if (currentPage * 40 >= totalHits) {
//                 loadMoreButton.style.display = 'none'; // Ховаємо кнопку, якщо дійшли до кінця колекції
//                 Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//             }

//             initializeLightbox(); // Ініціалізуємо SimpleLightbox для нових карток зображень
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
//     }
// }

// function createMarkup(arr) {
//     return arr
//         .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
//             `<div class="photo-card">
//             <a class="gallery__link" href="${largeImageURL}">
//                 <img class="img-card" src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}"/>
//             </a>
//             <div class="info">
//                 <p class="info-item">
//                     <b class="bb">Likes<span class="span-opt">${likes}</span></b>
//                 </p>
//                 <p class="info-item">
//                     <b class="bb">Views<span class="span-opt">${views}</span></b>
//                 </p>
//                 <p class="info-item">
//                     <b class="bb">Comments<span class="span-opt">${comments}</span></b>
//                 </p>
//                 <p class="info-item">
//                     <b class="bb">Downloads<span class="span-opt">${downloads}</span></b>
//                 </p> 
//             </div>
//         </div>`
//         )
//         .join('');
// }

// function handleSubmit(event) {
//     event.preventDefault();
//     const form = event.target;
//     const searchQuery = form.searchQuery.value.trim();

//     if (searchQuery !== '') {
//         currentSearchQuery = searchQuery;
//         currentPage = 1;
//         loadMoreButton.style.display = 'none'; // Ховаємо кнопку перед новим запитом
//         searchImages(searchQuery);
//     }
// }

// function loadMoreImages() {
//     currentPage += 1;
//     searchImages(currentSearchQuery);
// }

// function initializeLightbox() {
//     if (lightbox) {
//         lightbox.refresh(); // Оновлюємо SimpleLightbox для нових карток зображень
//     } else {
//         lightbox = new SimpleLightbox('.gallery a', {
//             captionsData: 'alt',
//             captionDelay: 250,
//         });
//     }
// }

// const formElement = document.getElementById('search-form');
// formElement.addEventListener('submit', handleSubmit);

// loadMoreButton.addEventListener('click', loadMoreImages);

