import { axiosInstance } from '../api/axios.config'
import { API_ENDPOINTS } from "../api/endpoints";
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const reviewService = {
    getReviewsByCourse: async (courseId, page) => {
        try{
            const size = 1;
            console.log(courseId);
            const res = await axios.get(`${API_URL}/api/courses/${courseId}/reviews?page=${page}&size=${size}`,);

            // content가 빈 배열일 때 reviews.message를 반환
            if (res.data.reviews.content.length === 0) {
                return {
                    reviews: [], // message를 반환
                    totalPages: res.data.reviews.totalPages,
                    message: res.data.message
                };
            }

            return {
                reviews: res.data.reviews.content,
                totalPages: res.data.reviews.totalPages
            }
        }catch(error){
            throw error;
        }
    },

    getLikeStatus: async (reviewId) => {
        try {
            const idToken = localStorage.getItem("idToken"); // localStorage에서 idToken 가져오기
            const headers = idToken ? { Authorization: `Bearer ${idToken}` } : {}; // Authorization 헤더 설정

            const res = await axios.get(`${API_URL}/api/reviews/${reviewId}/likes`, { headers });
            return res.data; // 좋아요 상태를 반환
        } catch (error) {
            throw error;
        }
    }
}