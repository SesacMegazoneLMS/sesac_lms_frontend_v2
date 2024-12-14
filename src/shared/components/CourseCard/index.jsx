import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../store/slices/cartSlice';
import { toast } from 'react-toastify';

// 모든 강의 이미지 import
import BigDataAnalysis from '../../../assets/images/courses/BigDataAnalysis.png';
import career from '../../../assets/images/courses/career.png';
import Clang from '../../../assets/images/courses/Clang.png';
import fullstack from '../../../assets/images/courses/fullstack.png';
import GameDesigner from '../../../assets/images/courses/GameDesigner.png';
import GameProgrammer from '../../../assets/images/courses/GameProgrammer.png';
import JavaStart from '../../../assets/images/courses/JavaStart.png';
import Kind from '../../../assets/images/courses/Kind.png';
import Kubernetes from '../../../assets/images/courses/Kubernetes.png';
import MidjourneyTechniques from '../../../assets/images/courses/MidjourneyTechniques.png';
import MlAIEngineer from '../../../assets/images/courses/MlAIEngineer.png';
import Python60mins from '../../../assets/images/courses/Python60mins.png';
import Python2024 from '../../../assets/images/courses/Python2024.png';
import SpringBoot from '../../../assets/images/courses/SpringBoot.png';

const defaultImages = [
  BigDataAnalysis, career, Clang, fullstack, GameDesigner,
  GameProgrammer, JavaStart, Kind, Kubernetes, MidjourneyTechniques,
  MlAIEngineer, Python60mins, Python2024, SpringBoot
];

const CourseCard = ({ course, type = 'course' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEnrolled = type === 'enrolled';
  const isCart = type === 'cart';

  // 랜덤 이미지 선택 (컴포넌트 마운트 시 한 번만 실행)
  const randomImage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  }, []);

  if (!course) return null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      thumbnail: randomImage // 랜덤 이미지 사용
    }));
    toast.success('장바구니에 추가되었습니다.');
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
          src={randomImage}
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
                handleAddToCart(e);
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
            <span className="text-sm text-gray-500 line-through">
              ₩{(course.price * 1.2)?.toLocaleString()}
            </span>
            <span className={`font-bold text-[#1e40af] ${isCart ? 'text-base' : 'text-lg'}`}>
              ₩{course.price?.toLocaleString() ?? 0}
            </span>
          </div>
          {!isCart && (
            <div className="text-xs bg-[#fff7ed] text-[#ea580c] px-2 py-1 rounded">
              {course.totalLectures}개 강의
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;