import { axiosInstance } from '../api/axios.config'
import { API_ENDPOINTS } from "../api/endpoints";
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const reviewService = {
    getReviewsByCourse: async (courseId, page) => {
        try{
            const size = 1;
            const res = await axios.get(`http://localhost:8081/api/courses/${courseId}/reviews?page=${page}&size=${size}`,);

            console.log("res : " + JSON.stringify(res.data));
            return {
                reviews: res.data.reviews.content,
                totalPages: res.data.reviews.totalPages
            }
        }catch(error){
            throw error;
        }
    }
}