import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


function CourseContentPage() {
    const { courseId } = useParams();
    const [courseData, setCourseData] = useState({
      title: '',
      curriculum: []
    });
  
    useEffect(() => {
      const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const course = courses.find(c => c.id === courseId);
      if (course) {
        setCourseData({
          ...course,
          curriculum: course.curriculum || []
        });
      }
    }, [courseId]);

  const handleFileUpload = async (sectionIndex, lectureIndex, file) => {
    try {
      const fileInfo = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      };

      const updatedCurriculum = [...courseData.curriculum];
      if (!updatedCurriculum[sectionIndex].lectures[lectureIndex].materials) {
        updatedCurriculum[sectionIndex].lectures[lectureIndex].materials = [];
      }
      updatedCurriculum[sectionIndex].lectures[lectureIndex].materials.push(fileInfo);
      setCourseData({...courseData, curriculum: updatedCurriculum});
      toast.success('파일이 업로드되었습니다.');
    } catch (error) {
      toast.error('파일 업로드에 실패했습니다.');
    }
  };

  const handleDeleteMaterial = (sectionIndex, lectureIndex, materialId) => {
    const updatedCurriculum = [...courseData.curriculum];
    const materials = updatedCurriculum[sectionIndex].lectures[lectureIndex].materials;
    updatedCurriculum[sectionIndex].lectures[lectureIndex].materials = 
      materials.filter(m => m.id !== materialId);
    setCourseData({...courseData, curriculum: updatedCurriculum});
  };

  const handleAddSection = () => {
    const newSection = {
      sectionId: courseData.curriculum.length + 1,
      title: `섹션 ${courseData.curriculum.length + 1}`,
      lectures: []
    };
    
    const updatedCurriculum = [...courseData.curriculum, newSection];
    setCourseData({...courseData, curriculum: updatedCurriculum});
  };

  const handleAddLecture = (sectionIndex) => {
    const newLecture = {
      id: Date.now(),
      title: '새 강의',
      duration: '00:00',
      isFree: false,
      videoUrl: '',
      materials: []
    };

    const updatedCurriculum = [...courseData.curriculum];
    updatedCurriculum[sectionIndex].lectures.push(newLecture);
    setCourseData({...courseData, curriculum: updatedCurriculum});
  };

  const handleSave = () => {
    try {
      const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const updatedCourses = courses.map(course => 
        course.id === parseInt(courseId) ? { ...course, curriculum: courseData.curriculum } : course
      );
      localStorage.setItem('published_courses', JSON.stringify(updatedCourses));
      toast.success('콘텐츠가 저장되었습니다.');
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    }
  };

  if (!courseData) return <div>로딩중...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">콘텐츠 관리: {courseData.title}</h1>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          저장
        </button>
      </div>

      {/* 커리큘럼 섹션 */}
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
            {/* 섹션 제목 */}
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  const updatedCurriculum = [...courseData.curriculum];
                  updatedCurriculum[sectionIndex].title = e.target.value;
                  setCourseData({...courseData, curriculum: updatedCurriculum});
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

            {/* 강의 목록 */}
            <div className="space-y-4">
              {section.lectures.map((lecture, lectureIndex) => (
                <div key={lecture.id} className="space-y-4 p-4 bg-gray-50 rounded">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={lecture.title}
                      onChange={(e) => {
                        const updatedCurriculum = [...courseData.curriculum];
                        updatedCurriculum[sectionIndex].lectures[lectureIndex].title = e.target.value;
                        setCourseData({...courseData, curriculum: updatedCurriculum});
                      }}
                      className="flex-1 px-2 py-1 border rounded"
                      placeholder="강의 제목"
                    />
                    <input
                      type="text"
                      value={lecture.videoUrl}
                      onChange={(e) => {
                        const updatedCurriculum = [...courseData.curriculum];
                        updatedCurriculum[sectionIndex].lectures[lectureIndex].videoUrl = e.target.value;
                        setCourseData({...courseData, curriculum: updatedCurriculum});
                      }}
                      placeholder="비디오 URL"
                      className="flex-1 px-2 py-1 border rounded"
                    />
                  </div>
                  
                  {/* 자료 업로드 섹션 */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">강의 자료</span>
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(sectionIndex, lectureIndex, e.target.files[0])}
                        className="hidden"
                        id={`file-upload-${lecture.id}`}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                      />
                      <label
                        htmlFor={`file-upload-${lecture.id}`}
                        className="text-sm text-primary hover:text-primary-dark cursor-pointer"
                      >
                        파일 추가
                      </label>
                    </div>

                    {/* 업로드된 파일 목록 */}
                    {lecture.materials && lecture.materials.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {lecture.materials.map(material => (
                          <div key={material.id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                            <a 
                              href={material.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary-dark"
                            >
                              {material.name}
                            </a>
                            <button
                              onClick={() => handleDeleteMaterial(sectionIndex, lectureIndex, material.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              삭제
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseContentPage;