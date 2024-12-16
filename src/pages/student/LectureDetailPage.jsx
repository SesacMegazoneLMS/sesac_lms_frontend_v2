// front/src/pages/student/LectureDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../shared/components/common/LoadingSpinner';
import { CourseService } from '../../infrastructure/services/CourseService';
import CourseDetailTabs from '../course/components/CourseDetailTabs';
import InstructorSection from '../course/components/InstructorSection';

function LectureDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseData = await CourseService.getCourseById(parseInt(courseId));
        setCourse(courseData);
      } catch (error) {
        toast.error('강좌 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    console.log(course);
  }, [course]);

  const handleStartLecture = (lectureId) => {
    navigate(`/courses/${courseId}/lectures/${lectureId}`);
  };

  if (!course) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        {/* 강좌 헤더 섹션 */}
        <div className="p-6 border-b border-gray-200">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {course.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-lg text-gray-600">{course.description}</p>
        </div>

        {/* 탭 네비게이션 */}
        <CourseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {activeTab === 'curriculum' && (
            <div className="space-y-8">
              {/* 학습 목표 섹션 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">학습 목표</h2>
                <ul className="space-y-2">
                  {course.objectives?.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-800">
                        ✓
                      </span>
                      <span className="ml-3 text-gray-600">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 커리큘럼 섹션 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">커리큘럼</h2>
                <div className="space-y-3">
                  {course.lectures?.map((lecture) => (
                    <div
                      key={lecture.id}
                      onClick={() => handleStartLecture(lecture.id)}
                      className={`
                        flex justify-between items-center p-4 rounded-lg cursor-pointer
                        transition-all duration-200 ease-in-out
                        ${lecture.status === 'COMPLETED'
                          ? 'bg-white border-l-4 border-green-500 hover:bg-gray-50'
                          : 'bg-gray-50 border-l-4 border-gray-300 opacity-75 cursor-not-allowed'}
                      `}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500 font-medium min-w-[48px]">
                          {lecture.orderIndex}강
                        </span>
                        <h3 className="text-gray-900 font-medium">{lecture.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{lecture.duration}</span>
                        <span className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${lecture.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'}
                        `}>
                          {lecture.status === 'COMPLETED' ? '시청 가능' : '처리 중'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <InstructorSection instructor={course.instructor} />
          )}
        </div>
      </div>
    </div>
  );
}

export default LectureDetailPage;