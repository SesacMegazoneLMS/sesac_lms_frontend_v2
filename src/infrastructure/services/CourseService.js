import { axiosInstance } from '../api/axios.config';
import { API_ENDPOINTS } from '../api/endpoints';

// export const getCourses = async () => {
//   try {
//     const response = await axiosInstance.get(API_ENDPOINTS.COURSES.LIST);
//     console.log("response:", response);
//     const data = response.data?.courses || response.data;
//     return Array.isArray(data) ? data : [];
//   } catch (error) {
//     console.error('강좌 목록 조회 실패:', error);
//     return [];
//   }
// };

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

export const CourseService = {

  // getAllCourses: async () => {
  //   try {
  //     const response = await axiosInstance.get(API_ENDPOINTS.COURSES.LIST);
  //     console.log("response:", response);
  //     const data = response.data?.courses || response.data;
  //     return Array.isArray(data) ? data : [];
  //   } catch (error) {
  //     console.error('강좌 목록 조회 실패:', error);
  //     return [];
  //   }
  // },

  getCourses: async (params = {}) => {
    try {
      // 빈 값은 제외하고 파라미터 구성
      const queryParams = {};
      if (params.sort) queryParams.sort = params.sort;
      if (params.category) queryParams.category = params.category;
      if (params.level) queryParams.level = params.level;
      if (params.search) queryParams.search = params.search;
      queryParams.page = params.page;
      queryParams.size = params.size;

      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.LIST, {
        params: queryParams
      });

      return {
        courses: response.data.courses,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
        currentPage: response.data.currentPage,
        message: response.data.message
      };
    } catch (error) {
      console.error('강좌 목록 조회 실패: ', error);
      throw error;
    }
  },

  getCourseById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.COURSES.DETAIL(id));

      return {
        message: response.data.message,
        data: response.data.courseDetails
      };
    } catch (error) {
      if (error.response) {
        return {
          message: error.response.data?.message || '요청 실패',
        };
      } else {
        return {
          message: '네트워크 오류가 발생했습니다.'
        }
      }
    }
    // try {
    //   const response = await api.get(API_ENDPOINTS.COURSES.DETAIL);
    //   const courses = response.data?.courses || response.data || [];
    //   const course = Array.isArray(courses) ?
    //     courses.find(c => c.id === courseId) : null;

    //   if (!course) throw new Error('강좌를 찾을 수 없습니다.');

    //   return {
    //     ...course,
    //     curriculum: course.curriculum || [],
    //     reviews: course.reviews || [],
    //     instructor_details: course.instructor_details || {
    //       name: course.instructor,
    //       profile_image: '/default-profile.png',
    //       bio: '강사 소개가 없습니다.'
    //     }
    //   };
    // } catch (error) {
    //   console.error('강좌 상세 정보 조회 실패:', error);
    //   throw error;
    // }
  }
};

export const OrderService = {

  createOrder: async (orderData) => {

    console.log("orderData: ", orderData)

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, {
        courses: orderData.courses,
        totalAmount: orderData.totalAmount
      });
      // const cartData = response.data?.cart || {};
      // const orders = cartData.orders || [];
      return response.data

      // const newOrder = {
      //   orderId: `ORD-${Date.now()}`,
      //   merchantUid: `MERCHANT-${Date.now()}`,
      //   userId: orderData.studentId,
      //   items: orderData.items,
      //   totalAmount: orderData.totalAmount,
      //   status: 'pending',
      //   createdAt: new Date().toISOString()
      // };

      // return newOrder;
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
      // const cartData = response.data?.cart || {};
      // const transactions = cartData.transactions || [];
      return response.data;

      // const newTransaction = {
      //   transactionId: `TRX-${Date.now()}`,
      //   orderId: paymentData.orderId,
      //   paymentMethod: 'kakaopay',
      //   amount: paymentData.amount,
      //   status: 'completed',
      //   paidAt: new Date().toISOString()
      // };

      // return newTransaction;
    } catch (error) {
      console.error('결제 검증 실패:', error);
      throw error;
    }
  }
};

export default CourseService;