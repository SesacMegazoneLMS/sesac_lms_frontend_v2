import { axiosInstance } from './axios.config';

const BASE_URL = process.env.REACT_APP_BACKEND_API_URL;

export const API_ENDPOINTS = {
  COURSES: {
    LIST: `${BASE_URL}/api/courses`,
    DETAIL: (id) => `${BASE_URL}/api/courses/${id}`,
  },
  USERS: {
    ENROLLMENTS: `${BASE_URL}/api/enrollments`
  },
  ORDERS: {
    CREATE: `${BASE_URL}/api/orders`
  },
  CART: '/cart.json',
  ROADMAPS: '/roadmaps.json',
  COMMUNITY: '/community.json',
  PAYMENTS: {
    VERIFY: `${BASE_URL}/api/payments/verify`,
  }
};

export const apiEndpoints = {

  cart: {
    getCart: async (userId) => {
      const response = await axiosInstance.get(API_ENDPOINTS.CART);
      const cartData = response.data?.cart || {};
      return cartData.orders?.find(order => order.userId === userId) || null;
    }
  },

  getOrderHistory: async (userId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.CART);
    const cartData = response.data?.cart || {};
    return cartData.orders?.filter(order => order.userId === userId) || [];
  }
};
