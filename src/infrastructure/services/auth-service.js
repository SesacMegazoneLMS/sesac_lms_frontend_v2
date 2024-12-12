import axios from "axios";
import { AUTH_ENDPOINTS } from "../api/auth-endpoints";

export const AUTH_SERVICE = {
  login: async (email, password) => {
    AUTH_ENDPOINTS.login.request = { email, password };

    const loginResponse = await axios.post(
      AUTH_ENDPOINTS.login.url,
      AUTH_ENDPOINTS.login.request,
      {
        headers: {
          "Content-Type": "application/json",
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

  signup: () => { },

  verify: () => { },

  resendCode: () => { },

  exchangeCode: () => { },
};