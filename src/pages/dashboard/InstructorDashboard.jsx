import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateStatistics } from '../../shared/utils/instructorStats';
import { toast } from 'react-toastify';

function InstructorDashboard() {
  const { user } = useSelector(state => state.auth);
  const [courses, setCourses] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCourses: 0,
    totalStudents: 0, 
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0
  });
  const [recentFeedback, setRecentFeedback] = useState([]);

  useEffect(() => {
    const loadInstructorData = async () => {
      // 강좌 데이터 로드
      const coursesData = JSON.parse(localStorage.getItem('published_courses') || '[]');
      const instructorCourses = coursesData.filter(
        course => course.instructor_id === user.id
      );
      setCourses(instructorCourses);
      
      // 통계 계산
      const stats = {
        totalCourses: instructorCourses.length,
        totalStudents: instructorCourses.reduce((acc, course) => acc + (course.enrolledCount || 0), 0),
        averageRating: 0, // 리뷰 기능 구현 후 계산
        totalRevenue: 0,  // 결제 기능 구현 후 계산
        monthlyRevenue: 0 // 결제 기능 구현 후 계산
      };
      setStatistics(stats);

      // 최근 피드백 로드
      const feedbackData = JSON.parse(localStorage.getItem('course_feedback') || '[]');
      const recentInstructorFeedback = feedbackData
        .filter(feedback => feedback.instructor_id === user.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentFeedback(recentInstructorFeedback);
    };
    
    loadInstructorData();
  }, [user.id]);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('정말로 이 강좌를 삭제하시겠습니까?')) {
      try {
        const courses = JSON.parse(localStorage.getItem('published_courses') || '[]');
        const updatedCourses = courses.filter(course => course.id !== courseId);
        localStorage.setItem('published_courses', JSON.stringify(updatedCourses));
        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
        
        // 통계 업데이트
        setStatistics(prev => ({
          ...prev,
          totalCourses: prev.totalCourses - 1
        }));
        
        toast.success('강좌가 삭제되었습니다.');
      } catch (error) {
        toast.error('강좌 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* 강사 프로필 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={user.profile_image || '/default-profile.png'} 
              alt={user.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          </div>
          <Link 
            to="/profile"
            className="text-primary hover:text-primary-dark"
          >
            프로필 관리
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 강좌 통계 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">강좌 통계</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>총 강좌 수</span>
              <span className="font-medium">{statistics.totalCourses}개</span>
            </div>
            <div className="flex justify-between">
              <span>총 수강생</span>
              <span className="font-medium">{statistics.totalStudents}명</span>
            </div>
            <div className="flex justify-between">
              <span>평균 평점</span>
              <span className="font-medium">{statistics.averageRating.toFixed(1)}점</span>
            </div>
          </div>
        </div>

        {/* 수익 현황 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">수익 현황</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>이번 달 수익</span>
              <span className="font-medium">₩{statistics.monthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>총 수익</span>
              <span className="font-medium">₩{statistics.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 최근 문의/피드백 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">최근 문의/피드백</h2>
          <div className="space-y-4">
            {recentFeedback.map(feedback => (
              <div key={feedback.id} className="border-b pb-3">
                <div className="flex justify-between">
                  <span className="font-medium">{feedback.studentName}</span>
                  <span className="text-sm text-gray-500">{feedback.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{feedback.content}</p>
                <Link 
                  to={`/instructor/feedback/${feedback.id}`}
                  className="text-primary text-sm hover:text-primary-dark mt-2 inline-block"
                >
                  답변하기
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 강좌 관리 */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">강좌 관리</h2>
          <Link 
            to="/instructor/course/create"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            새 강좌 만들기
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map(course => (
            <div key={course.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{course.title}</h3>
                <span className="text-sm text-gray-500">
                  수강생: {course.enrolledCount}명
                </span>
              </div>
              <div className="mt-4 flex space-x-4">
                <Link 
                  to={`/instructor/course/${course.id}/edit`}
                  className="text-primary hover:text-primary-dark"
                >
                  강좌 관리
                </Link>
                <Link 
                  to={`/instructor/course/${course.id}/content`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  콘텐츠 관리
                </Link>
                <Link 
                  to={`/instructor/course/${course.id}/quiz`}
                  className="text-gray-500 hover:text-gray-700"
                >
                  퀴즈 관리
                </Link>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;