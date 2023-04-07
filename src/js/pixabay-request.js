import axios from 'axios';

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

async function getImgs() {
  return await axios.request(options);
}

export { getImgs, options };

