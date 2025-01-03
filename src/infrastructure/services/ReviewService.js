import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const reviewService = {
    getReviewsByCourse: async (courseId, page) => {
        try {
            const size = 1;
            const res = await axios.get(`${API_URL}/api/courses/${courseId}/reviews?page=${page}&size=${size}`);

            if (res.data.content.length === 0) {
                return {
                    reviews: [],
                    totalPages: res.data.totalPages,
                    message: "등록된 리뷰가 없습니다."
                }
            }

            return {
                reviews: res.data.content,
                totalPages: res.data.totalPages
            };
        } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            throw error
        }
    },

    getLikeStatus: async (reviewId) => {
        try {
            const idToken = localStorage.getItem("idToken"); // localStorage에서 idToken 가져오기
            const headers = idToken ? {Authorization: `Bearer ${idToken}`} : {}; // Authorization 헤더 설정

            const res = await axios.get(`${API_URL}/api/reviews/${reviewId}/likes`, {headers});
            console.log( "likesData : " + JSON.stringify(res.data) )
            return res.data; // 좋아요 상태를 반환
        } catch (error) {
            throw error;
        }
    },

    toggleLike: async (reviewId, user) => {
      const res = await axios.post(`${API_URL}/api/reviews/${reviewId}/likes`, {},{
          headers: {
              'Authorization': `Bearer ${user}`
          }
      });
        if (res.status === 200){
            console.log(res.data);
            return res.data
        }
    },

    createReview: async (user, course, reviewContent, reviewRating) => {
        try {
            const res = await axios.post(`${API_URL}/api/reviews`, {
                    courseId: course.id,
                    content: reviewContent,
                    rating: reviewRating
                },
                {
                    headers: {'Authorization': `Bearer ${user}`}
                });
            if (res.status === 200) {
                return {
                    success: true,
                    message: res.data
                };
            }
        } catch (error) {
            throw error;
        }
    },

    deleteReview: async (reviewId, user) => {
        try {
            const res = await axios.delete(`${API_URL}/api/reviews/${reviewId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${user}`
                    }
                });
            if (res.status === 200) {
                return {
                    success: true,
                    message: res.data
                };
            }
        } catch (error) {
            throw error;
        }
    },

    updateReview: async (reviewId, user, content, rating) => {
        try {
            const res = await axios.put(`${API_URL}/api/reviews/${reviewId}`, {
                    content: content,
                    rating: rating
                },
                {
                    headers: {
                        'Authorization': `Bearer ${user}`
                    }
                });
            if (res.status === 200) {
                return {
                    success: true,
                    message: res.data
                };
            }
        } catch (error) {
            throw error;
        }
    },

}
