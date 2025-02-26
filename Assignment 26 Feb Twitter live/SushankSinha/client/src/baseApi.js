import axios from 'axios';

const instance = axios.create({
  baseURL: "http://localhost:7500/api/books"
});

export default instance;