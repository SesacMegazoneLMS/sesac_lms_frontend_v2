import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from "axios";

function CourseCreatePage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: 'programming',
    level: '초급',
    price: 0,
    thumbnail: '',
    objectives: [],
    requirements: [],
    skills: [],
    lectures: [],
  });

  const handleAddSection = () => {
    setCourseData(prev => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          sectionId: prev.curriculum.length + 1,
          title: `섹션 ${prev.curriculum.length + 1}`,
          lectures: []
        }
      ]
    }));
  };

  const handleSaveDraft = async () => {
    try {
      const draftCourse = {
        id: `draft_${Date.now()}`,
        instructor_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'draft',
        ...courseData
      };
      
      const drafts = JSON.parse(localStorage.getItem('draft_courses') || '[]');
      drafts.push(draftCourse);
      localStorage.setItem('draft_courses', JSON.stringify(drafts));
      
      toast.success('임시저장되었습니다.');
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      // 필수 입력값 검증
      if (!courseData.title) {
        console.error('강좌명을 입력해주세요.');
        return;
      }else if(!courseData.description){
        console.error("강좌에 대한 설명을 입력해주세요.")
        return;
      }

      const res =
          await axios.post("http://localhost:8081/api/courses",
            courseData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("idToken")}`
              },
          });
        const courseId = res.data.courseId;
        alert(res.data.message);

        navigate(`/instructor/course/${courseId}/content`);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">새 강좌 만들기</h1>
        <div className="space-x-4">
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            임시저장
          </button>
          <button
            onClick={() => handleCreateCourse(courseData)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            강좌 생성
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
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
              강좌내용
            </label>
            <input
                type="text"
                value={courseData.description}
                onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              난이도
            </label>
            <select
                value={courseData.level} // courseData의 난이도 속성에 맞게 수정
                onChange={(e) => setCourseData({...courseData, level: e.target.value})} // 난이도 속성 업데이트
                className="w-full px-3 py-2 border rounded-md"
            >
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <select
                value={courseData.category} // courseData의 난이도 속성에 맞게 수정
                onChange={(e) => setCourseData({...courseData, category: e.target.value})} // 난이도 속성 업데이트
                className="w-full px-3 py-2 border rounded-md"
            >
              <option value="programming">프로그래밍</option>
              <option value="frontend">프런트엔드</option>
              <option value="backend">백엔드</option>
              <option value="AI">AI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <div className="flex items-center">
            <input
                type="number"
                value={courseData.price}
                onChange={(e) => setCourseData({...courseData, price: Number(e.target.value)})}
                className="w-full px-3 py-2 border rounded-md"
                min="0" // 최소값 설정
                step="1" // 소수점 두 자리까지 입력 가능
                placeholder="가격을 입력하세요" // 플레이스홀더 추가
            />
            <span className="text-sm font-medium text-gray-700">원</span>
            </div>
          </div>
          {/* 다른 기본 정보 필드들... */}
        </div>
      </div>
    </div>
  );
}

export default CourseCreatePage;