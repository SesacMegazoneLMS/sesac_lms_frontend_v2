import { axiosInstance } from '../api/axios.config';
import { API_ENDPOINTS } from '../api/endpoints';
import axios from 'axios';

export const StatsService = {

  getInstructorStats: async () => {

    try {
      const response = await axiosInstance.get(API_ENDPOINTS.STATS.INSTRUCTOR);
      const stats = response.data;

      return {
        totalStudents: stats.totalStudents || 0,
        activeCourses: stats.activeCourses || 0,
        totalRevenue: stats.totalRevenue || 0,
        averageRating: stats.averageRating || 0,
        monthlyStats: stats.monthlyStats || {
          revenue: 0,
          newStudents: 0,
          averageRating: 0
        },
        monthlyRevenue: stats.monthlyRevenue || [],  // 빈 배열을 기본값으로
        totalStudentsTrend: stats.totalStudentsTrend || {
          value: 0,
          trend: 0,
          trendType: 'NO_CHANGE',
          isNew: false
        },
        monthlyRevenueTrend: stats.monthlyRevenueTrend || {
          value: 0,
          trend: 0,
          trendType: 'NO_CHANGE',
          isNew: false
        },
        averageRatingTrend: stats.averageRatingTrend || {
          value: 0,
          trend: 0,
          trendType: 'NO_CHANGE',
          isNew: false
        },
        studentsDetail: stats.studentsDetail || {
          total: 0,
          currentMonth: 0,
          previousMonth: 0,
          trend: {
            value: 0,
            trend: 0,
            trendType: 'NO_CHANGE',
            isNew: false
          },
          currentMonthLabel: '',
          previousMonthLabel: ''
        },
        revenueDetail: stats.revenueDetail || {
          total: 0,
          currentMonth: 0,
          previousMonth: 0,
          trend: {
            value: 0,
            trend: 0,
            trendType: 'NO_CHANGE',
            isNew: false
          },
          currentMonthLabel: '',
          previousMonthLabel: ''
        }
      };

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
  },

  getRecentEnrollments: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.STATS.RECENT_ENROLLMENTS);
      console.log('Service(getRecentEnrollments): ', response.data.recentEnrollments)
      return response.data.recentEnrollments;

    } catch (error) {
      console.error('최근 수강신청 내역 로드 실패')
      throw error;
    }
  },

  getRecentReviews: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.STATS.RECENT_REVIEWS);
      console.log('Service(getRecentReviews): ', response.data.recentReviews)
      return response.data.recentReviews;

    } catch (error) {
      console.error('최근 리뷰 내역 로드 실패')
      throw error;
    }
  }

}