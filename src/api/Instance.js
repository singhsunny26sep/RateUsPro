import axios from 'axios';

export const Instance = axios.create({
  baseURL: 'https://rateusbackend.onrender.com',
  // baseURL: 'http://192.168.0.108:5000',
});
