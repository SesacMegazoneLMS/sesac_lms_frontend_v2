import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cartService } from '../../../infrastructure/services/CartService';
import { getCourseImage } from '../../utils/imageUtils'; // import

const CourseCard = ({ course, type = 'course' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEnrolled = type === 'enrolled';
  const isCart = type === 'cart';

  const courseImage = getCourseImage(course);


  if (!course) return null;

  const handleAddToCart = async (course) => {
    try {
      const res = await cartService.addToCart(course.id);
      if (res.success) {
        alert(res.message); // 성공 메시지 표시
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
    } catch (error) {
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
          {/* {!isCart && (
                <div className="text-xs bg-[#fff7ed] text-[#ea580c] px-2 py-1 rounded">
                  {course.totalLectures}개 강의
                </div>
            )} */}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;