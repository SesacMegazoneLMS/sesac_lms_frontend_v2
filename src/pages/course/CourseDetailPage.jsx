import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../infrastructure/services/CourseService';
import CurriculumSection from './CurriculumSection';
import DescriptionSection from './DescriptionSection';
import ReviewsSection from './ReviewsSection';

function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum');

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await getCourseById(parseInt(id));
      setCourse(data);
    };
    fetchCourse();
  }, [id]);

  if (!course) return <div>로딩중...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 강좌 헤더 섹션 */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="col-span-2">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{course.category}</span>
            <span className="mx-2">•</span>
            <span>{course.level}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              <span>{course.rating}</span>
              <span className="text-gray-500 ml-1">
                ({course.students.toLocaleString()}명 수강중)
              </span>
            </div>
            <div>
              <span className="text-gray-500">
                최근 업데이트: 2024.11
              </span>
            </div>
          </div>

          {/* 강사 정보 */}
          <div className="mt-6 flex items-center space-x-4">
            <img 
              src={course.instructor_details?.profile_image} 
              alt={course.instructor_details?.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-medium">{course.instructor_details?.name}</h3>
              <p className="text-sm text-gray-600">{course.instructor_details?.bio}</p>
            </div>
          </div>

          {/* 프로젝트 정보 */}
          {course.projects && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">실습 프로젝트</h3>
              {course.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-2">
                  <h4 className="font-medium">{project.title}</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 수강신청 카드 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full rounded-lg mb-4"
          />
          <div className="text-3xl font-bold mb-4">
            ₩{course.price.toLocaleString()}
          </div>
          <button className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark mb-4">
            수강신청하기
          </button>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>총 {course.totalLectures}개 강의</span>
              <span>{course.totalHours}</span>
            </div>
            <div className="flex justify-between">
              <span>난이도</span>
              <span>{course.level}</span>
            </div>
            <div className="flex justify-between">
              <span>수료증 발급</span>
              <span>가능</span>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b mb-8">
        <div className="flex space-x-8">
          {['curriculum', 'description', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 -mb-px ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500'
              }`}
            >
              {tab === 'curriculum' && '커리큘럼'}
              {tab === 'description' && '상세소개'}
              {tab === 'reviews' && '수강평'}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="bg-white rounded-lg p-6">
      {activeTab === 'curriculum' && (
  <div>
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">강의 구성</h2>
      <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>총 {course.totalLectures}개 강의</span>
                <span>•</span>
                <span>{course.totalHours}</span>
              </div>
            </div>
            <CurriculumSection curriculum={course.curriculum} />
          </div>
        )}
        {activeTab === 'description' && (
          <DescriptionSection course={course} />
        )}
        {activeTab === 'reviews' && (
          <ReviewsSection reviews={course.reviews} />
        )}
      </div>
    </div>
  );
}

export default CourseDetailPage;