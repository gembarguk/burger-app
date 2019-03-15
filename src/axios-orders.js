import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-b8c8f.firebaseio.com/'
});

export default instance;