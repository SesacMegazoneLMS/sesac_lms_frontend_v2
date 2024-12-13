import axios from 'axios';
import store from '../../store/store'; // Redux store import

export const axiosInstance = axios.create({
    // baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        // 요청 시점의 최신 state에서 토큰 가져오기
        const state = store.getState();
        const token = state.auth.user?.idToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        Promise.reject(error)
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    //   {
    //   if (typeof response.data === 'string') {
    //     try {
    //       response.data = JSON.parse(response.data);
    //     } catch (e) {
    //       console.error('JSON 파싱 실패:', e);
    //     }
    //   }
    //   return response;
    // },
    (error) => {
        console.error('API 요청 실패:', error);
        return Promise.reject(error);
    }
);