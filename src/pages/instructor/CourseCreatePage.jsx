import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function CourseCreatePage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: 0,
    curriculum: [
      {
        sectionId: 1,
        title: '섹션 1',
        lectures: []
      }
    ],
    materials: [],
    requirements: [],
    objectives: []
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

  const handleAddLecture = (sectionIndex) => {
    const newCurriculum = [...courseData.curriculum];
    newCurriculum[sectionIndex].lectures.push({
      id: Date.now(),
      title: '새 강의',
      duration: '00:00',
      videoUrl: '',
      materials: []
    });
    setCourseData({ ...courseData, curriculum: newCurriculum });
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

  const handleCreateCourse = async () => {
    try {
      // 필수 입력값 검증
      if (!courseData.title) {
        toast.error('강좌명을 입력해주세요.');
        return;
      }

      if (!courseData.curriculum || courseData.curriculum.length === 0) {
        toast.error('최소 1개 이상의 섹션을 추가해주세요.');
        return;
      }

      // 강좌 데이터 생성
      const newCourse = {
        id: `course_${Date.now()}`,
        instructor_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'published',
        enrolledCount: 0,
        rating: 0,
        reviewCount: 0,
        instructor_details: {
          name: user.name,
          profile_image: user.profile_image || '/default-profile.png',
          bio: user.bio || '강사 소개가 없습니다.'
        },
        ...courseData,
        price: Number(courseData.price) || 0
      };

      // 로컬스토리지에 저장
      const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const isDuplicate = courses.some(course => course.title === courseData.title);
      
      if (isDuplicate) {
        toast.error('이미 동일한 이름의 강좌가 존재합니다.');
        return;
      }

      courses.push(newCourse);
      localStorage.setItem('published_courses', JSON.stringify(courses));

      // 임시저장 데이터가 있다면 삭제
      const drafts = JSON.parse(localStorage.getItem('draft_courses') || '[]');
      const filteredDrafts = drafts.filter(draft => draft.id !== courseData.id);
      localStorage.setItem('draft_courses', JSON.stringify(filteredDrafts));

      toast.success('강좌가 성공적으로 생성되었습니다.');
      navigate('/dashboard');
    } catch (error) {
      console.error('강좌 생성 오류:', error);
      toast.error('강좌 생성에 실패했습니다. 다시 시도해주세요.');
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
            onClick={handleCreateCourse}
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
          {/* 다른 기본 정보 필드들... */}
        </div>
      </div>

      {/* 커리큘럼 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">커리큘럼</h2>
          <button
            onClick={handleAddSection}
            className="text-primary hover:text-primary-dark"
          >
            섹션 추가
          </button>
        </div>

        {courseData.curriculum.map((section, sectionIndex) => (
          <div key={section.sectionId} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  const newCurriculum = [...courseData.curriculum];
                  newCurriculum[sectionIndex].title = e.target.value;
                  setCourseData({...courseData, curriculum: newCurriculum});
                }}
                className="font-medium px-2 py-1 border rounded"
              />
              <button
                onClick={() => handleAddLecture(sectionIndex)}
                className="text-sm text-primary hover:text-primary-dark"
              >
                강의 추가
              </button>
            </div>

            <div className="space-y-2">
              {section.lectures.map((lecture, lectureIndex) => (
                <div key={lecture.id} className="flex items-center space-x-4 pl-4">
                  <input
                    type="text"
                    value={lecture.title}
                    onChange={(e) => {
                      const newCurriculum = [...courseData.curriculum];
                      newCurriculum[sectionIndex].lectures[lectureIndex].title = e.target.value;
                      setCourseData({...courseData, curriculum: newCurriculum});
                    }}
                    className="flex-1 px-2 py-1 border rounded"
                  />
                  <button className="text-sm text-gray-500 hover:text-gray-700">
                    동영상 업로드
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseCreatePage;