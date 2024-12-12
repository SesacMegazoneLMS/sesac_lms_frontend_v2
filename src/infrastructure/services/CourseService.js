import { api } from '../api/axios.config';
import { API_ENDPOINTS } from '../api/endpoints';

export const getCourses = async () => {
  try {
    const response = await api.get(`${process.env.REACT_APP_PAYMENT_API_URL}/api/courses`);
    console.log("response:", response);
    const data = response.data?.courses || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('강좌 목록 조회 실패:', error);
    return [];
  }
};

export const getRoadmaps = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.ROADMAPS);
    const data = response.data?.roadmaps || response.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('로드맵 조회 실패:', error);
    return [];
  }
};

export const CourseService = {
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(API_ENDPOINTS.COURSES);
      const courses = response.data?.courses || response.data || [];
      const course = Array.isArray(courses) ?
        courses.find(c => c.id === courseId) : null;

      if (!course) throw new Error('강좌를 찾을 수 없습니다.');

      return {
        ...course,
        curriculum: course.curriculum || [],
        reviews: course.reviews || [],
        instructor_details: course.instructor_details || {
          name: course.instructor,
          profile_image: '/default-profile.png',
          bio: '강사 소개가 없습니다.'
        }
      };
    } catch (error) {
      console.error('강좌 상세 정보 조회 실패:', error);
      throw error;
    }
  }
};

export default CourseService;