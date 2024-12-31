import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const cartService = {
    addToCart: async (courseId) => {
        try {
            const res = await axios.post(
                `${API_URL}/api/carts/items`,
                {
                    courseId: courseId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
                    }
                }
            );

            if (res.status === 200) {
                return {
                    success: true,
                    message: res.data
                };
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;

                switch (status) {
                    case 403: // SecurityException
                        return {
                            success: false,
                            message: '로그인이 필요한 서비스입니다.',
                            type: 'AUTH_ERROR'
                        };

                    case 400: // IllegalArgumentException
                        return {
                            success: false,
                            message: '이미 장바구니에 등록된 강좌입니다.',
                            type: 'DUPLICATE_ERROR'
                        };

                    default: // RuntimeException 및 기타 예외
                        return {
                            success: false,
                            message: '장바구니 담기에 실패했습니다.',
                            type: 'RUNTIME_ERROR'
                        };
                }
            }

            // 네트워크 오류 등 기타 예외 처리
            return {
                success: false,
                message: '서버와의 통신 중 오류가 발생했습니다.',
                type: 'NETWORK_ERROR'
            };
        }
    },

    getCarts: async () => {
        try{
            const page = 1;
            const size = 5;
            const res = await axios.get(`${API_URL}/api/carts?page=${page}&size=${size}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('idToken')}`
                }
            });
            return res.data;
        }catch (error){
            throw error;
        }
    },

    deleteFromCart: async (index) => {
        try{
            const index2 = index + 1;
            const res = await axios.delete(`${API_URL}/api/carts/items/${index2}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('idToken')}`
                    }
                });
            return res.data;
        }catch (error){
            throw error;
        }
    }
}