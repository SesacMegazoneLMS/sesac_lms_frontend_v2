const AUTH_URL = `${process.env.REACT_APP_AUTH_API_URL}`;
const BACKEND_URL = `${process.env.REACT_APP_BACKEND_API_URL}/api`;
const GOOGLE_REQUEST = ``;

const kakaoParams = new URLSearchParams({
  identity_provider: "kakao",
  client_id: "6tuhkvilko0ea253l36d4n3uec",
  response_type: "code",
  redirect_uri: `${process.env.REACT_APP_AUTH_CALLBACK_URL}/auth/callback2`,
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
