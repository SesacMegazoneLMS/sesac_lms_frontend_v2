import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cartService } from '../../../infrastructure/services/CartService';
import { getCourseImage } from '../../utils/imageUtils'; // import
import axios from 'axios';  // axios 추가
import cartCount from "../../../store/actions/cartActions"; // cartCount import


const CourseCard = ({ course, type = 'course' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lectureProgress, setLectureProgress] = useState({
    completedCount: 0,
    totalCount: 0,
    progressPercent: 0
  });
  const navigate = useNavigate();
  const isEnrolled = type === 'enrolled';
  const isCart = type === 'cart';
  const user = localStorage.getItem('idToken');
  const dispatch = useDispatch();

  useEffect(() => {
    // 수강 중인 강좌일 때만 강의 진행률 정보를 가져옴
    if (isEnrolled && course.id) {
      fetchLectureProgress();
    }
  }, [course.id, isEnrolled]);

  const fetchLectureProgress = async () => {
    try {
      const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/courses/${course.id}/progress`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('idToken')}`
            }
          }
      );

      console.log('Progress response:', JSON.stringify(response.data)); // 데이터 확인용 로그

      // 백엔드 응답 구조에 맞게 수정하고 진도율은 정수로 변환
      setLectureProgress({
        completedCount: response.data.completedLectures,
        totalCount: response.data.totalLectures,
        progressPercent: Math.floor(response.data.progressRate) // Math.floor로 소수점 제거
      });
    } catch (error) {
      console.error('Failed to fetch lecture progress:', error);
    }
  };

  const courseImage = getCourseImage(course);

  if (!course) return null;

  const handleAddToCart = async (course) => {
    try{
      const res = await cartService.addToCart(user, course.id);
      if (res.success) {
        alert(res.message); // 성공 메시지 표시
        dispatch(cartCount()); // 추가: cartCount dispatch
      } else {
        // 에러 타입에 따른 처리
        switch (res.type) {
          case 'AUTH_ERROR':
            // 로그인 페이지로 리다이렉트하거나 로그인 모달 표시
            break;
          case 'DUPLICATE_ERROR':
            // 중복 알림 표시
            break;
          case 'RUNTIME_ERROR':
          case 'NETWORK_ERROR':
            // 일반 에러 메시지 표시
            break;
        }
        alert(res.message);
      }
    }catch(error){
      alert('장바구니에 동일한 강좌가 있습니다.');
    }
  };

  const handleCardClick = () => {
    if (isEnrolled) {
      navigate(`/courses/${course.id}/detail`);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
      <div
          className={`
        bg-white rounded-lg shadow hover:shadow-lg transition-all cursor-pointer
        ${isCart ? 'grid grid-cols-[180px,1fr] h-32' : 'hover:-translate-y-1'}
      `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleCardClick}
      >
        <div className={`relative ${isCart ? 'h-full' : ''}`}>
          <img
              src={courseImage}
              alt={course.title}
              className={`
            object-cover
            ${isCart ? 'h-full w-full rounded-l-lg' : 'w-full h-48 rounded-t-lg'}
          `}
          />
          {!isEnrolled && !isCart && isHovered && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(course);
                    }}
                    className="bg-[#00c471] text-white px-4 py-2 rounded hover:bg-[#00a65f]"
                >
                  장바구니에 담기
                </button>
              </div>
          )}
        </div>

        <div className={`${isCart ? 'p-3' : 'p-4'}`}>
          <h3 className={`font-semibold text-gray-900 mb-1 line-clamp-1 
          ${isCart ? 'text-base' : 'text-lg'}`}>
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>

          {!isCart && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">{course.category}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                                {course.level}
                            </span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-sm text-gray-500 ml-2">
                                ({course.students?.toLocaleString() ?? 0}명)
                            </span>
                </div>
              </>
          )}

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {!isNaN(course.price) && (
                  <>
                <span className="text-sm text-gray-500 line-through">
                  ₩{(course.price * 1.2)?.toLocaleString()}
                </span>
                    <span className={`font-bold text-[#1e40af] ${isCart ? 'text-base' : 'text-lg'}`}>
                  ₩{course.price?.toLocaleString() ?? 0}
                </span>
                  </>
              )}
            </div>
          </div>
          
          {/* 25.01.03 홍인표 작성. 수강 중인 강좌의 진행률을 표시하는 코드 */}
          {isEnrolled && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>진행률: {lectureProgress.progressPercent}%</span>
                  <span>
                {lectureProgress.completedCount}/{lectureProgress.totalCount} 강의
              </span>
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full">
                  <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${lectureProgress.progressPercent}%` }}
                  />
                </div>
                {lectureProgress.completedCount === lectureProgress.totalCount &&
                    lectureProgress.totalCount > 0 && (
                        <span className="mt-1 inline-block px-2 py-1 text-xs text-green-700 bg-green-100 rounded">
                  수강 완료
                </span>
                    )}
              </div>
          )}
        </div>
      </div>
  );
};

export default CourseCard;