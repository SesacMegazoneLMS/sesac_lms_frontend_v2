import { axiosInstance } from '../api/axios.config';
import { API_ENDPOINTS } from '../api/endpoints';
import axios from 'axios';

export const userService = {
  getMyEnrollments: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USERS.ENROLLMENTS);

      if (!response.data) {
        throw new Error('데이터가 없습니다.');
      }

      return {
        enrollments: response.data.courses || [],
        message: response.data.message
      };

    } catch (error) {
      console.error("수강 중인 강의 조회 실패: ", error);

      if (error.response) {
        throw new Error(error.response.data?.message || '강의 목록을 불러오는데 실패했습니다.');
      }

      throw new Error('네트워크 오류가 발생했습니다.');
    }
  }
}

export const getRoadmaps = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ROADMAPS);
    const data = response.data?.roadmaps || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('로드맵 조회 실패:', error);
    return [];
  }
};

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const CourseService = {

  getCourses: async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.level) params.append('level', filters.level);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('size', filters.size.toString());

      const response = await axios.get(`${API_URL}/api/courses?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      });

      return {
        courses: response.data.courses,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        currentPage: response.data.currentPage,
        message: response.data.message
      };
    } catch (error) {
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export const OrderService = {
  createOrder: async (orderData) => {

    console.log("orderData: ", orderData);

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, {
        courses: orderData.courses,
        totalAmount: orderData.totalAmount
      });
      return response.data
    } catch (error) {
      console.error('주문 생성 실패:', error);
      throw error;
    }
  }
};

export const PaymentService = {
  verifyPayment: async (paymentData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.VERIFY, {
        impUid: paymentData.impUid,
        merchantUid: paymentData.merchantUid,
        buyerName: paymentData.buyerName,
        amount: paymentData.amount,
        status: paymentData.status,
        payMethod: paymentData.payMethod
      });
      return response.data;
    } catch (error) {
      console.error('결제 검증 실패:', error);
      throw error;
    }
  }
};
export default CourseService;
