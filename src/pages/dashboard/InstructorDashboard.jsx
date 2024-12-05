import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FiUsers, FiBookOpen, FiDollarSign, FiStar, 
  FiTrendingUp, FiActivity, FiMessageCircle, FiPlus, FiEdit2, FiSave, FiUpload 
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import InstructorMyPage from '../instructor/InstructorMyPage';
import CourseQuizPage from '../instructor/CourseQuizPage';

function InstructorDashboard() {
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    completionRate: 0
  });

  const [recentCourses, setRecentCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quizzes, setQuizzes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    expertise: user?.expertise || [],
    education: user?.education || [],
    experience: user?.experience || [],
    socialLinks: user?.socialLinks || {
      website: '',
      linkedin: '',
      github: ''
    },
    profileImage: user?.profileImage || '/default-avatar.png'
  });

  const tabs = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'courses', label: '강좌 관리' },
    { id: 'quizzes', label: '퀴즈 관리' },
    { id: 'profile', label: '프로필 관리' }  // 새로운 탭 추가
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // TODO: API 연동 시 실제 데이터로 교체
        const mockStats = {
          totalStudents: 150,
          totalCourses: 5,
          totalRevenue: 3000000,
          monthlyRevenue: 800000,
          averageRating: 4.5,
          completionRate: 78
        };

        const mockCourses = [
          { 
            id: 1, 
            title: "React 완벽 가이드", 
            students: 45, 
            rating: 4.8, 
            progress: 100,
            lastUpdated: "2024-03-20",
            income: 1200000
          },
          // ... 더 많은 강좌 데이터
        ];

        const mockEnrollments = [
          { 
            id: 1, 
            studentName: "김철수", 
            courseName: "React 완벽 가이드", 
            date: "2024-03-20",
            profileImage: "/default-avatar.png"
          },
          // ... 더 많은 수강생 데이터
        ];

        const mockReviews = [
          {
            id: 1,
            studentName: "이영희",
            courseName: "React 완벽 가이드",
            rating: 5,
            content: "정말 유익한 강의였습니다. 무에서 바로 적용할 수 있는 내용이라 좋았어요.",
            date: "2024-03-19"
          },
          // ... 더 많은 리뷰 데이터
        ];

        const mockRevenueData = [
          { month: '1월', revenue: 500000 },
          { month: '2월', revenue: 700000 },
          { month: '3월', revenue: 800000 },
          // ... 더 많은 수익 데이터
        ];

        const mockQuizzes = [
          {
            id: 1,
            title: 'React 기초 퀴즈',
            courseName: 'React 완벽 가이드',
            questions: 10,
            attempts: 25,
            avgScore: 85
          },
          {
            id: 2,
            title: '컴포넌트 심화 퀴즈',
            courseName: 'React 완벽 가이드',
            questions: 15,
            attempts: 20,
            avgScore: 78
          }
        ];

        setStats(mockStats);
        setRecentCourses(mockCourses);
        setRecentEnrollments(mockEnrollments);
        setRecentReviews(mockReviews);
        setRevenueData(mockRevenueData);
        setQuizzes(mockQuizzes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* 강사 프로필 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <img 
            src={user.profileImage || "/default-avatar.png"} 
            alt={user.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.bio || "강사 소개를 입력해주세요"}</p>
          </div>
          <Link 
            to="/instructor/profile" 
            className="ml-auto text-primary hover:text-primary-dark"
          >
            프로필 수정
          </Link>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="총 수강생" 
          value={`${stats.totalStudents}명`}
          icon={<FiUsers />}
          trend="+12% 증가"
        />
        <StatCard 
          title="운영 중인 강좌"
          value={`${stats.totalCourses}개`}
          icon={<FiBookOpen />}
        />
        <StatCard 
          title="이번 달 수익" 
          value={`${stats.monthlyRevenue.toLocaleString()}원`}
          icon={<FiDollarSign />}
          trend="+8% 증가"
        />
        <StatCard 
          title="평균 평점" 
          value={stats.averageRating.toFixed(1)}
          icon={<FiStar />}
          trend="+0.2 상승"
        />
      </div>

      {/* 수익 차트 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">월별 수익 추이</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#4F46E5" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 최근 강좌 현황 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">최근 강좌 현황</h2>
          <Link 
            to="/instructor/courses" 
            className="text-primary hover:text-primary-dark"
          >
            전체보기
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  강좌명
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수강생
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  평점
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수익
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  진행률
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  최근 업데이트
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentCourses.map(course => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/instructor/courses/${course.id}`}
                      className="text-primary hover:text-primary-dark"
                    >
                      {course.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {course.students}명
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {course.income.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                    {course.lastUpdated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 활동 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 수강신청 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">최근 수강신청</h2>
          <div className="space-y-4">
            {recentEnrollments.map(enrollment => (
              <div key={enrollment.id} className="flex items-center space-x-4">
                <img 
                  src={enrollment.profileImage} 
                  alt={enrollment.studentName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium">{enrollment.studentName}</p>
                  <p className="text-sm text-gray-500">{enrollment.courseName}</p>
                </div>
                <span className="text-sm text-gray-500">{enrollment.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 수강평 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">최근 수강평</h2>
          <div className="space-y-4">
            {recentReviews.map(review => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{review.studentName}</span>
                  <div className="flex items-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    {review.rating}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{review.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{review.courseName}</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoursesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">강좌 관리</h2>
        <Link
          to="/instructor/course/create"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FiPlus className="mr-2" />
          새 강좌 만들기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">강좌명</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">수강생</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">평점</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody>
            {recentCourses.map(course => (
              <tr key={course.id} className="border-b">
                <td className="px-6 py-4">{course.title}</td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    공개
                  </span>
                </td>
                <td className="px-6 py-4 text-center">{course.students}명</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    {course.rating}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`/instructor/course/${course.id}/edit`}
                      className="text-primary hover:text-primary-dark"
                    >
                      수정
                    </Link>
                    <Link
                      to={`/instructor/course/${course.id}/content`}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      콘텐츠
                    </Link>
                    <Link
                      to={`/instructor/course/${course.id}/quiz`}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      퀴즈
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQuizzesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">퀴즈 관리</h2>
      </div>
      
      {/* CourseQuizPage 컴포넌트 재사용 */}
      <CourseQuizPage />
    </div>
  );

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: API 연동 시 실제 저장 로직 구현
      toast.success('프로필이 저장되었습니다.');
      setIsEditing(false);
    } catch (error) {
      toast.error('프로필 저장에 실패했습니다.');
    }
  };

  const renderProfileContent = () => (
    <InstructorMyPage />
  );

  return (
    <div className="p-6">
      {/* 탭 메뉴 */}
      <div className="mb-6 border-b">
        <div className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'dashboard' && renderDashboardContent()}
      {activeTab === 'courses' && renderCoursesContent()}
      {activeTab === 'quizzes' && renderQuizzesContent()}
      {activeTab === 'profile' && renderProfileContent()}
    </div>
  );
}

// 통계 카드 컴포넌트
function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className="text-sm text-green-500 flex items-center mt-1">
              <FiTrendingUp className="mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className="text-primary text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;