import axios from "axios";
import store from "../../store/store"; // Redux store import

const BASE_URL =
  "https://sesac-lms-frontend-mockdb.s3.ap-northeast-2.amazonaws.com";

export const api = axios.create({
  // baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // 요청 시점의 최신 state에서 토큰 가져오기
    const state = store.getState();
    const token = state.auth.user?.idToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // data 폴더 경로 유지
    if (!config.url.startsWith("/data/") && config.url.endsWith(".json")) {
      config.url = `/data${config.url}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (typeof response.data === "string") {
      try {
        response.data = JSON.parse(response.data);
      } catch (e) {
        console.error("JSON 파싱 실패:", e);
      }
    }
    return response;
  },
  (error) => {
    console.error("API 요청 실패:", error);
    return Promise.reject(error);
  }
);
