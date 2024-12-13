import axios from 'axios';
import store from '../../store/store';

export const api = axios.create({
  baseURL: process.env.REACT_APP_PAYMENT_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  withCredentials: false
});

export const axiosInstance = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API 요청 실패:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.user?.idToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 요청 실패:', error);
    return Promise.reject(error);
  }
);