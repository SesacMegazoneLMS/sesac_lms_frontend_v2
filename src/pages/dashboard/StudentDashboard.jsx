import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

function StudentDashboard() {
  const { user } = useSelector(state => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [learningHistory, setLearningHistory] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // courses.json에서 수강 중인 강좌 정보 가져오기
        const coursesResponse = await fetch('/mock/db/courses.json');
        const coursesData = await coursesResponse.json();
        
        // enrollments.json에서 사용자의 수강 정보 가져오기
        const enrollmentsResponse = await fetch('/mock/db/enrollments.json');
        const enrollmentsData = await enrollmentsResponse.json();
        
        // 현재 사용자의 수강 정보 필터링
        const userEnrollments = enrollmentsData.enrollments.filter(
          enrollment => enrollment.userId === user?.id
        );
        
        // 수강 중인 강좌 정보 매핑
        const userCourses = userEnrollments.map(enrollment => {
          const courseInfo = coursesData.courses.find(
            course => course.id === enrollment.courseId
          );
          return {
            ...courseInfo,
            progress: enrollment.progress,
            lastAccessedLecture: enrollment.lastAccessedLecture
          };
        });
        
        setEnrolledCourses(userCourses);
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };

    // user가 존재할 때만 데이터 로드
    if (user?.id) {
      loadStudentData();
    }
  }, [user?.id]); // user?.id로 의존성 변경

  return (
    <div className="space-y-6 p-6">
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">안녕하세요, {user?.name}님!</h1>
        <div className="flex space-x-4">
          <Link to="/profile" className="text-primary hover:text-primary-dark">
            프로필 관리
          </Link>
          <Link to="/certificates" className="text-primary hover:text-primary-dark">
            수료증 관리
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 수강 중인 강좌 */}
        <div className="bg-white p-6 rounded-lg shadow col-span-2">
          <h2 className="text-lg font-semibold mb-4">수강 중인 강좌</h2>
          <div className="space-y-4">
            {enrolledCourses.map(course => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{course.title}</h3>
                  <span className="text-sm text-gray-500">진도율: {course.progress}%</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Link 
                    to={`/course/${course.id}/learn`}
                    className="text-primary hover:text-primary-dark"
                  >
                    이어서 학습하기
                  </Link>
                  <Link 
                    to={`/course/${course.id}/materials`}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    학습자료
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 학습 통계 */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">나의 학습 통계</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>총 학습시간</span>
                <span className="font-medium">23시간</span>
              </div>
              <div className="flex justify-between">
                <span>이번 주 학습</span>
                <span className="font-medium">5시간</span>
              </div>
              <div className="flex justify-between">
                <span>완료한 강좌</span>
                <span className="font-medium">3개</span>
              </div>
            </div>
          </div>

          {/* 예정된 퀴즈/과제 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">예정된 퀴즈/과제</h2>
            <div className="space-y-3">
              {upcomingQuizzes.map(quiz => (
                <div key={quiz.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{quiz.title}</div>
                    <div className="text-sm text-gray-500">{quiz.dueDate}</div>
                  </div>
                  <Link 
                    to={`/quiz/${quiz.id}`}
                    className="text-primary hover:text-primary-dark"
                  >
                    응시하기
                  </Link>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;