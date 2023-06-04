import axios from 'axios';
import Notiflix from 'notiflix';

async function searchImages(searchQuery, currentPage) {
    const API_KEY = '37016805-d1d678301f08548020cdd855a';

    const params = {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: currentPage,
    };

    try {
        const response = await axios.get('https://pixabay.com/api/', { params });
        const { hits, totalHits } = response.data;
        const images = hits;

        if (images.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {
            return { images, totalHits };
        }
    } catch (error) {
        console.error('Error:', error);
        Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
        return { images: [], totalHits: 0 };
    }
}

export default searchImages;