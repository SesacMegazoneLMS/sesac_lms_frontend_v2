import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const MOCK_QUIZZES = [
  {
    id: 1,
    title: 'React 기초 개념 퀴즈',
    questions: [
      {
        id: 101,
        question: 'React에서 상태 관리를 위해 사용하는 Hook은?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 0
      },
      {
        id: 102,
        question: 'React 컴포넌트의 생명주기를 관리하는 Hook은?',
        options: ['useState', 'useEffect', 'useContext', 'useRef'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 2,
    title: 'React Hooks 심화 퀴즈',
    questions: [
      {
        id: 201,
        question: 'useCallback Hook의 주요 용도는?',
        options: [
          '함수의 메모이제이션',
          '상태 관리',
          'DOM 조작',
          '비동기 처리'
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 3,
    title: 'React Router 퀴즈',
    questions: [
      {
        id: 301,
        question: 'React Router에서 동적 라우팅을 위해 사용하는 문법은?',
        options: [
          ':parameter',
          '*parameter',
          '?parameter',
          '&parameter'
        ],
        correctAnswer: 0
      }
    ]
  }
];

function CourseQuizPage({ courseId }) {
    const [courseData, setCourseData] = useState({
      title: '',
      quizzes: []
    });
  
    useEffect(() => {
      const fetchQuizzes = () => {
        try {
          const savedQuizzes = JSON.parse(localStorage.getItem('published_courses') || '[]');
          
          if (!savedQuizzes.length) {
            setCourseData({
              title: '전체 퀴즈',
              quizzes: MOCK_QUIZZES
            });
            return;
          }

          if (courseId) {
            const course = savedQuizzes.find(c => c.id === courseId);
            if (course) {
              setCourseData({
                ...course,
                quizzes: course.quizzes || []
              });
            }
          } else {
            const allQuizzes = savedQuizzes.reduce((acc, course) => {
              return [...acc, ...(course.quizzes || []).map(quiz => ({
                ...quiz,
                courseName: course.title
              }))];
            }, []);
            setCourseData({
              title: '전체 퀴즈',
              quizzes: allQuizzes
            });
          }
        } catch (error) {
          console.error('퀴즈 데이터 로딩 중 오류:', error);
          setCourseData({
            title: '전체 퀴즈',
            quizzes: MOCK_QUIZZES
          });
        }
      };

      fetchQuizzes();
    }, [courseId]);


  const handleAddQuiz = () => {
    setCourseData(prev => ({
      ...prev,
      quizzes: [
        ...prev.quizzes,
        {
          id: Date.now(),
          title: '새 퀴즈',
          questions: []
        }
      ]
    }));
  };

  const handleAddQuestion = (quizIndex) => {
    const newQuizzes = [...courseData.quizzes];
    newQuizzes[quizIndex].questions.push({
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    setCourseData({ ...courseData, quizzes: newQuizzes });
  };

  const handleSave = async () => {
    try {
      const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const updatedCourses = courses.map(course => 
        course.id === courseId ? { ...course, quizzes: courseData.quizzes } : course
      );
      localStorage.setItem('published_courses', JSON.stringify(updatedCourses));
      toast.success('퀴즈가 저장되었습니다.');
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">퀴즈 관리: {courseData.title}</h1>
        <div className="space-x-4">
          <button
            onClick={handleAddQuiz}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            새 퀴즈 추가
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            저장
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {courseData.quizzes.map((quiz, quizIndex) => (
          <div key={quiz.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => {
                  const newQuizzes = [...courseData.quizzes];
                  newQuizzes[quizIndex].title = e.target.value;
                  setCourseData({...courseData, quizzes: newQuizzes});
                }}
                className="text-lg font-semibold px-2 py-1 border rounded"
              />
              <button
                onClick={() => handleAddQuestion(quizIndex)}
                className="text-primary hover:text-primary-dark"
              >
                문제 추가
              </button>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((question, questionIndex) => (
                <div key={question.id} className="border p-4 rounded-lg">
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => {
                      const newQuizzes = [...courseData.quizzes];
                      newQuizzes[quizIndex].questions[questionIndex].question = e.target.value;
                      setCourseData({...courseData, quizzes: newQuizzes});
                    }}
                    placeholder="문제를 입력하세요"
                    className="w-full px-2 py-1 border rounded mb-4"
                  />
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => {
                            const newQuizzes = [...courseData.quizzes];
                            newQuizzes[quizIndex].questions[questionIndex].correctAnswer = optionIndex;
                            setCourseData({...courseData, quizzes: newQuizzes});
                          }}
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newQuizzes = [...courseData.quizzes];
                            newQuizzes[quizIndex].questions[questionIndex].options[optionIndex] = e.target.value;
                            setCourseData({...courseData, quizzes: newQuizzes});
                          }}
                          placeholder={`보기 ${optionIndex + 1}`}
                          className="flex-1 px-2 py-1 border rounded"
                        />
                      </div>
                    ))}
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

export default CourseQuizPage;