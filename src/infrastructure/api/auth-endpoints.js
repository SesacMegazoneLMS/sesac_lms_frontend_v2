const AUTH_URL = `https://auth.sesac-univ.click`;
const BACKEND_URL = `https://api.sesac-univ.click/api`;
const GOOGLE_REQUEST = ``;
const KAKAO_REQUEST = ``;
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
    url: `${AUTH_URL}/auth/resend_code`,
    request: { email: "" },
    response: { message: "" },
  },

  exchange_code: {
    url: `${AUTH_URL}/auth/exchange_code`,
    request: { code: "" },
    response: {
      accessToken: "",
      idToken: "",
      refreshToken: "",
      isProfileComplete: false,
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