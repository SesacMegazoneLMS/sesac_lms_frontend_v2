import axios from "axios";
import { AUTH_ENDPOINTS } from "../../infrastructure/api/endpoints";

export const AUTH_SERVICE = {
  login: async (email, password) => {
    AUTH_ENDPOINTS.login.request = { email, password };

    const loginResponse = await axios.post(
      AUTH_ENDPOINTS.login.url,
      AUTH_ENDPOINTS.login.request,
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );

    AUTH_ENDPOINTS.login.response = loginResponse.data;

    const { accessToken, idToken, refreshToken } =
      AUTH_ENDPOINTS.login.response.tokens;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("idToken", idToken);
    localStorage.setItem("refreshToken", refreshToken);

    const infoResponse = await axios.get(AUTH_ENDPOINTS.login.profile_url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    AUTH_ENDPOINTS.login.userInfo = infoResponse.data;

    return AUTH_ENDPOINTS.login.userInfo;
  },

  signup: async (email, password, name, phone, address, userType) => {
    AUTH_ENDPOINTS.signup.request = {
      email,
      password,
      name,
      phone,
      address,
      userType,
    };

    const signupResponse = await axios.post(
      AUTH_ENDPOINTS.signup.url,
      AUTH_ENDPOINTS.signup.request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return signupResponse;
  },

  verify: async (email, code) => {
    AUTH_ENDPOINTS.verify.request = { email, code };

    const verifyResponse = await axios.post(
      AUTH_ENDPOINTS.verify.url,
      AUTH_ENDPOINTS.verify.request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return verifyResponse;
  },

  resendCode: async (email) => {
    AUTH_ENDPOINTS.resend_code.request = { email };

    const resendCodeResponse = await axios.post(
      AUTH_ENDPOINTS.resend_code.url,
      AUTH_ENDPOINTS.resend_code.request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return resendCodeResponse;
  },

  exchangeCode: async (uuid, name, userType, phone, address) => {
    AUTH_ENDPOINTS.exchange_code.request = {
      uuid,
      name,
      userType,
      phone,
      address,
    };

    const exchangeCodeResponse = await axios.post(
      AUTH_ENDPOINTS.exchange_code.url,
      AUTH_ENDPOINTS.exchange_code.request,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return exchangeCodeResponse;
  },
};
