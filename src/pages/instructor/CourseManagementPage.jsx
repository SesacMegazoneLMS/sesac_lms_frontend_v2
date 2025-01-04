import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import courseService from "../../infrastructure/services/CourseService";

function CourseManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = localStorage.getItem("idToken");
  const quillRef = useRef(null);

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
  });

  useEffect(() => {
    getCourseData(id);
  }, [id]);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const initialText = quill.getText();
      handleEditorChange(initialText);
      document.getElementById("descriptionCount").innerText = `0/100`;
    }
  }, []);

  const getCourseData = async (id) => {
    try {
      const res = await courseService.getCourseById(id);
      console.log("수정할 강의 정보 : " + JSON.stringify(res));
      // API 응답 데이터를 상태에 업데이트
      setCourseData(res);
    } catch (error) {
      console.error("강좌 정보 가져오기 실패:", error);
      toast.error('강좌 정보를 불러오는데 실패했습니다.');
    }
  };
  const countText = useCallback((text) => {
    if (!text) return 0;
    const textWithoutSpace = text.replace(/<[^>]*>/g, '').replace(/\s/g, '').replace(/[\n\r]/g, '');
    return textWithoutSpace.length;
  }, []);

  const handleTitleChange = (e) => {
    const currentTitle = e.target.value;
    const count = countText(currentTitle)
    if (count <= 50) {
      setCourseData({ ...courseData, title: currentTitle });
      document.getElementById("titleCount").innerText = `${count}/50`;
    }
  };

  const handleEditorChange = (value) => {
    const plainText = value.replace(/<[^>]*>/g, '')
    const count = countText(plainText)
    if (count <= 100) {
      setCourseData({ ...courseData, description: value });
      document.getElementById("descriptionCount").innerText = `${count}/100`;
    }
  };

  const handleEdit = async (id) => {
    try {
      // 필수 입력값 검증
      if (!courseData.title) {
        alert('강좌명을 입력해주세요.');
        return;
      } else if (!courseData.description) {
        alert('강좌에 대한 설명을 입력해주세요.');
        return;
      }

      const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/courses/${id}`,
          {
            title: courseData.title,
            description: courseData.description,
            category: courseData.category.toUpperCase(),
            level: courseData.level,
            price: courseData.price,
            objectives: courseData.objectives,
            requirements: courseData.requirements,
            skills: courseData.skills,
            lectures: courseData.lectures
          },
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
      );
      if (res.status === 200) {
        alert(res.data.message); // 성공 메시지 표시
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 오류 응답이 온 경우 (4xx 또는 5xx)
        const { status, data } = error.response;
        if (status === 400 && data && data.message) {
          alert(data.message); // 백엔드에서 준 오류 메시지 표시 (예: "동일한 이름의 강의가 존재합니다")
        } else if (status === 404 && data && data.message) {
          alert(data.message)
        } else {
          alert('강좌 수정에 실패했습니다.'); // 일반적인 오류 메시지
        }
      } else {
        // 네트워크 오류 등의 서버 응답이 없는 경우
        alert('강좌 수정 요청에 실패했습니다. 네트워크 상태를 확인해주세요.');
      }
    }
  };

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">강좌 수정</h1>
        </div>
        {/* 기본 정보 */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                강좌명
              </label>
              <input
                  type="text"
                  value={courseData.title}
                  onChange={handleTitleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="강좌명을 입력하세요"

              />
              <div className="flex justify-between">
                <div className="flex ml-auto">
                  <div id="titleCount" className="text-gray-500 text-sm">0/50</div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                난이도
              </label>
              <select
                  value={courseData.level}
                  onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
              >
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                강좌내용
              </label>
              <div className="editor-container">
                <ReactQuill
                    ref={quillRef}
                    value={courseData.description}
                    onChange={handleEditorChange}
                    theme="snow"
                    modules={{
                      toolbar: [
                        [{'header': [1, 2, false]}],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                        ['clean']
                      ],
                    }}
                    className="quill-editor"
                />
                <div className="flex justify-between">
                  <div className="flex ml-auto">
                    <div id="descriptionCount" className="text-gray-500 text-sm">0/100</div>
                  </div>
                </div>
              </div>
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
                    min="0"
                    step="1"
                    placeholder="가격을 입력하세요"
                />
                <span className="text-sm font-medium text-gray-700">원</span>
              </div>
            </div>
            {/* Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                학습 목표
              </label>
              {courseData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                        type="text"
                        value={objective}
                        onChange={(e) => {
                          const newObjectives = [...courseData.objectives];
                          newObjectives[index] = e.target.value;
                          setCourseData({...courseData, objectives: newObjectives});
                        }}
                        className="w-full px-3 py-2 border rounded-md mr-2"
                    />
                    <button
                        type="button"
                        onClick={() => {
                          const newObjectives = [...courseData.objectives];
                          newObjectives.splice(index, 1);
                          setCourseData({...courseData, objectives: newObjectives});
                        }}
                        className="px-3 py-1 text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
              ))}
              <button
                  type="button"
                  onClick={() =>
                      setCourseData({
                        ...courseData,
                        objectives: [...courseData.objectives, ""],
                      })
                  }
                  className="text-sm text-primary hover:text-primary-dark mt-2"
              >
                + 학습 목표 추가
              </button>
            </div>
            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                수강 요건
              </label>
              {courseData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                        type="text"
                        value={requirement}
                        onChange={(e) => {
                          const newRequirements = [...courseData.requirements];
                          newRequirements[index] = e.target.value;
                          setCourseData({...courseData, requirements: newRequirements});
                        }}
                        className="w-full px-3 py-2 border rounded-md mr-2"
                    />
                    <button
                        type="button"
                        onClick={() => {
                          const newRequirements = [...courseData.requirements];
                          newRequirements.splice(index, 1);
                          setCourseData({...courseData, requirements: newRequirements});
                        }}
                        className="px-3 py-1 text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
              ))}
              <button
                  type="button"
                  onClick={() =>
                      setCourseData({
                        ...courseData,
                        requirements: [...courseData.requirements, ""],
                      })
                  }
                  className="text-sm text-primary hover:text-primary-dark mt-2"
              >
                + 수강 요건 추가
              </button>
            </div>
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                습득 기술
              </label>
              {courseData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...courseData.skills];
                          newSkills[index] = e.target.value;
                          setCourseData({...courseData, skills: newSkills});
                        }}
                        className="w-full px-3 py-2 border rounded-md mr-2"
                    />
                    <button
                        type="button"
                        onClick={() => {
                          const newSkills = [...courseData.skills];
                          newSkills.splice(index, 1);
                          setCourseData({...courseData, skills: newSkills});
                        }}
                        className="px-3 py-1 text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
              ))}
              <button
                  type="button"
                  onClick={() =>
                      setCourseData({
                        ...courseData,
                        skills: [...courseData.skills, ""],
                      })
                  }
                  className="text-sm text-primary hover:text-primary-dark mt-2"
              >
                + 습득 기술 추가
              </button>
            </div>
          </div>
          {/* 에디터 스타일 추가 */}
          <style jsx>{`
                  .quill-editor .ql-editor{
                    min-height: 250px;
                    max-height: 500px;
                    overflow-y: auto;
                  }
                `}</style>
        </div>
        {/* 강좌 수정 버튼 */}
        <div className={'flex justify-end'}>
          <div className="space-x-4">
            <button
                onClick={() => handleEdit(id)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              수정
            </button>
          </div>
        </div>
      </div>
  );
}

export default CourseManagementPage;