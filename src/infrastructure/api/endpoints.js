import { api } from './axios.config';
// S3 Mock Data 엔드포인트
const MOCK_DATA = {
  COURSES: '/data/courses.json',
  USERS: '/data/users.json',
  ORDERS: '/data/orders.json'
};

// API 함수들
export const apiEndpoints = {
  // 강좌 관련
  courses: {
    getAll: () => api.get(MOCK_DATA.COURSES),
    getById: async (courseId) => {
      const courses = await api.get(MOCK_DATA.COURSES);
      return courses.find(course => course.id === courseId);
    }
  },

  // 장바구니 관련 (Mock)
  cart: {
    createOrder: async (orderData) => {
      // 실제 API 대신 Mock 응답
      return {
        orderId: `ORDER_${Date.now()}`,
        merchantUid: `merchant_${Date.now()}`,
        totalAmount: orderData.totalAmount,
        items: orderData.items,
        status: 'PENDING'
      };
    },

    processPayment: async (paymentData) => {
      // 결제 성공 Mock 응답
      return {
        success: true,
        paymentId: `PAY_${Date.now()}`,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        status: 'COMPLETED'
      };
    }
  },

  // 사용자 관련
  users: {
    getEnrolledCourses: async (userId) => {
      const users = await api.get(MOCK_DATA.USERS);
      const user = users.find(u => u.id === userId);
      return user?.enrolledCourses || [];
    }
  }
};
