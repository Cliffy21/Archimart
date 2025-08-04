// frontend/axios.js
import axios from 'axios';

export const nodeApi = axios.create({
  baseURL: 'http://localhost:5000/',
});

export const flaskApi = axios.create({
  baseURL: 'http://localhost:5001/',
});