import axios from 'axios';

export const Instance = axios.create({  
  baseURL: 'https://rateus-backend.onrender.com',
});
