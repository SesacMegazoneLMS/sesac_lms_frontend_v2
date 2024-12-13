import { api } from './axios.config';

const AUTH_URL = `${process.env.REACT_APP_AUTH_API_URL}`;
const BACKEND_URL = `${process.env.REACT_APP_BACKEND_API_URL}/api`;
const GOOGLE_REQUEST = ``;

const kakaoParams = new URLSearchParams({
  identity_provider: "kakao",
  client_id: "6tuhkvilko0ea253l36d4n3uec",
  response_type: "code",
  redirect_uri: `${process.env.REACT_APP_AUTH_CALLBACK_URL}/auth/callback`,
  scope: "openid aws.cognito.signin.user.admin",
});
const KAKAO_REQUEST = `https://ap-northeast-2ow5oyt4ja.auth.ap-northeast-2.amazoncognito.com/oauth2/authorize?${kakaoParams}`;
const NAVER_REQUEST = ``;

export const AUTH_ENDPOINTS = {
  login: {
    url: `${AUTH_URL}/auth/login`,
    profile_url: `${BACKEND_URL}/users/profile/`,
    request: { email: "", password: "" },
    response: {
      tokens: { idToken: "", accessToken: "", refreshToken: "" },
      user: { email: "", email_verified: "", "custom:userType": "", sub: "" },
    },
    userInfo: {
      statusCode: "",
      errorCode: "",
      message: "",
      user: {
        nickname: "",
        email: "",
        userType: "",
        phoneNumber: "",
        address: "",
      },
    },
  },

  signup: {
    url: `${AUTH_URL}/auth/signup`,
    request: {
      email: "",
      password: "",
      name: "",
      phone: "",
      address: "",
      userType: "",
    },
    response: { message: "", user: { id: "", email: "", name: "" } },
  },

  verify: {
    url: `${AUTH_URL}/auth/verify`,
    request: { email: "", code: "" },
    response: { message: "", isVerified: false },
  },

  resend_code: {
    url: `${AUTH_URL}/auth/resend-code`,
    request: { email: "" },
    response: { message: "" },
  },

  exchange_code: {
    url: `${AUTH_URL}/auth/complete-profile`,
    request: { uuid: "", code: "", name: "", phone: "", address: "" },
    response: {
      accessToken: "",
      idToken: "",
      refreshToken: "",
    },
  },

  google: {
    url: `${GOOGLE_REQUEST}`,
  },

  kakao: {
    url: `${KAKAO_REQUEST}`,
  },

  naver: {
    url: `${NAVER_REQUEST}`,
  },
};
export const API_ENDPOINTS = {
  COURSES: '/courses.json',
  USERS: '/users.json',
  ORDERS: '/orders.json',
  CART: '/cart.json',
  ROADMAPS: '/roadmaps.json',
  COMMUNITY: '/community.json',
  PAYMENTS: '/payments.json'
};

export const apiEndpoints = {
  cart: {
    getCart: async (userId) => {
      const response = await api.get(API_ENDPOINTS.CART);
      const cartData = response.data?.cart || {};
      return cartData.orders?.find(order => order.userId === userId) || null;
    }
  },

  payment: {
    createOrder: async (orderData) => {

      console.log("orderData: ", orderData)

      try {
        const response = await api.post(`${process.env.REACT_APP_PAYMENT_API_URL}/api/orders`, {
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
    },
    
    verifyPayment: async (paymentData) => {
      try {
        const response = await api.post(`${process.env.REACT_APP_PAYMENT_API_URL}/api/payments/verify`, {
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
  },

  getOrderHistory: async (userId) => {
    const response = await api.get(API_ENDPOINTS.CART);
    const cartData = response.data?.cart || {};
    return cartData.orders?.filter(order => order.userId === userId) || [];
  }
};
