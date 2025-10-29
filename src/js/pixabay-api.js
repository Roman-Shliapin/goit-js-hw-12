import axios from 'axios';


export async function getImagesByQuery(query, page = 1) {
  try {
    const { data } = await axios('https://pixabay.com/api/', {
      params: {
        key: '52807659-bebfa0ce69a97bf76a6d524af',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 15,
      },
    });
    return data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message:
        'Something went wrong while fetching data. Please try again later!',
      timeout: 4000,
      position: 'topRight',
    });
  }
}
