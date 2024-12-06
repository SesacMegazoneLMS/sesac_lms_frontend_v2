import { api } from './axios.config';

export const API_ENDPOINTS = {
  COURSES: '/courses.json',
  USERS: '/users.json',
  ORDERS: '/orders.json',
  CART: '/cart.json',
  ROADMAPS: '/roadmaps.json',
  COMMUNITY: '/community.json'
};

export const apiEndpoints = {
  cart: {
    getCart: async (userId) => {
      const response = await api.get(API_ENDPOINTS.CART);
      const cartData = response.data?.cart || {};
      return cartData.orders?.find(order => order.userId === userId) || null;
    },
    
    createOrder: async (orderData) => {
      try {
        const response = await api.get(API_ENDPOINTS.CART);
        const cartData = response.data?.cart || {};
        const orders = cartData.orders || [];
        
        const newOrder = {
          orderId: `ORD-${Date.now()}`,
          merchantUid: `MERCHANT-${Date.now()}`,
          userId: orderData.studentId,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          status: 'pending',
          createdAt: new Date().toISOString()
        };

        return newOrder;
      } catch (error) {
        console.error('주문 생성 실패:', error);
        throw error;
      }
    },

    processPayment: async (paymentData) => {
      try {
        const response = await api.get(API_ENDPOINTS.CART);
        const cartData = response.data?.cart || {};
        const transactions = cartData.transactions || [];

        const newTransaction = {
          transactionId: `TRX-${Date.now()}`,
          orderId: paymentData.orderId,
          paymentMethod: 'kakaopay',
          amount: paymentData.amount,
          status: 'completed',
          paidAt: new Date().toISOString()
        };

        return newTransaction;
      } catch (error) {
        console.error('결제 처리 실패:', error);
        throw error;
      }
    },

    getOrderHistory: async (userId) => {
      const response = await api.get(API_ENDPOINTS.CART);
      const cartData = response.data?.cart || {};
      return cartData.orders?.filter(order => order.userId === userId) || [];
    }
  }
};
