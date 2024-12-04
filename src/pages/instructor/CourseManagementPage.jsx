import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CourseManagementPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    status: 'draft'
  });

  useEffect(() => {
    if (courseId) {
      // 로컬스토리지에서 강좌 데이터 불러오기
      const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseData(course);
      }
    }
  }, [courseId]);

  const handleSave = async () => {
    try {
      const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, ...courseData } : course
      );
      localStorage.setItem('published_courses', JSON.stringify(updatedCourses));
      toast.success('저장되었습니다.');
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handlePublish = async () => {
    try {
      if (!courseData.title || !courseData.description) {
        toast.error('필수 정보를 입력해주세요.');
        return;
      }

      navigate('/instructor/dashboard');
      
      const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, ...courseData, status: 'published' } : course
      );
      localStorage.setItem('published_courses', JSON.stringify(updatedCourses));
      toast.success('강좌가 발행되었습니다.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('발행에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">강좌 관리</h1>
        <div className="space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            저장
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            강좌 발행
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              강좌명
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => setCourseData({...courseData, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData({...courseData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <select
              value={courseData.category}
              onChange={(e) => setCourseData({...courseData, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">선택하세요</option>
              <option value="programming">프로그래밍</option>
              <option value="design">디자인</option>
              <option value="business">비즈니스</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseManagementPage;