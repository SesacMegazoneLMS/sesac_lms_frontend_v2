import { axiosInstance } from '../api/axios.config';
import { API_ENDPOINTS } from '../api/endpoints';
import axios from 'axios';

export const StatsService = {

  getInstructorStats: async () => {

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.STATS.INSTRUCTOR);
      return response.data;

    } catch (error) {
      console.error('통계 로드 실패');
      throw error;
    }
  },

  manualUpdate: async () => {

    try {
      const response = await axiosInstance.post(API_ENDPOINTS.STATS.MANUAL_UPDATE);
      return response.data;

    } catch (error) {
      console.error('수동 업데이트 실패')
      throw error;
    }
  }

}