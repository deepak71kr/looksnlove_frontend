import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if needed
});
axios.defaults.withCredentials = true;
export default api;
