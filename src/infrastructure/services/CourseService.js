import { api } from '../api/axios.config';

export const getCourses = async () => {
  try {
    const response = await api.get('/api/courses');  // headers 제거
    console.log('courses response:', response);
    return response.data || [];
  } catch (error) {
    console.error('강좌 목록 조회 실패:', error);
    return [];
  }
};

export const getRoadmaps = async () => {
  try {
    const response = await api.get('/api/roadmaps');  // headers 제거
    console.log('roadmaps response:', response);
    return response.data || [];
  } catch (error) {
    console.error('로드맵 조회 실패:', error);
    return [];
  }
};

export const CourseService = {
  getCourseById: async (courseId) => {
    try {
      const response = await api.get(`/api/courses/${courseId}`);  // headers 제거
      const course = response.data;

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