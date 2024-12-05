import axios from 'axios';

const S3_BUCKET_URL = 'https://sesac-lms-frontend-mockdb.s3.ap-northeast-2.amazonaws.com';

export const api = axios.create({
  baseURL: S3_BUCKET_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
