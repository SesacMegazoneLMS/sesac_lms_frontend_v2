import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiUsers, FiBookOpen, FiDollarSign, FiStar,
  FiTrendingUp, FiTrendingDown, FiActivity, FiMessageCircle, FiPlus, FiEdit2, FiSave, FiUpload
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { StatsService } from '../../infrastructure/services/StatisticsService';
import InstructorMyPage from '../instructor/InstructorMyPage';
import CourseQuizPage from '../instructor/CourseQuizPage';
import ProfilePage from '../profile/ProfilePage';
import axios from "axios";
import Pagination from "../../shared/components/common/Pagination";

function InstructorDashboard() {
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    completionRate: 0,
    totalStudentsTrend: {
      value: 0,
      trend: 0,
      trendType: 'NO_CHANGE',
      isNew: false
    },
    monthlyRevenueTrend: {
      value: 0,
      trend: 0,
      trendType: 'NO_CHANGE',
      isNew: false
    },
    averageRatingTrend: {
      value: 0,
      trend: 0,
      trendType: 'NO_CHANGE',
      isNew: false
    }
  });

  const [recentCourses, setRecentCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quizzes, setQuizzes] = useState([]);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Default Profile",
    email: user?.email || '',
    bio: '강사 소개를 입력해주세요',
    expertise: [],
    socialLinks: {
      website: '',
      linkedin: '',
      github: ''
    },
    profileImage: '/saesac.png'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);

  const tabs = [
    { id: 'dashboard', label: '대시보드' },
    { id: 'courses', label: '강좌 관리' },
    { id: 'quizzes', label: '퀴즈 관리' },
    { id: 'profile', label: '프로필 관리' }
  ];

  const fetchInstructorProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/users/profile/instructor`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("idToken")}`
          }
        }
      );

      const { profile } = response.data;

      setProfileData(prev => ({
        ...prev,
        name: user?.name || "Default Profile",
        email: user?.email || '',
        bio: profile.introduction || '강사 소개를 입력해주세요',
        expertise: profile.techStack || [],
        socialLinks: {
          website: profile.websiteUrl || '',
          linkedin: profile.linkedinUrl || '',
          github: profile.githubUrl || ''
        },
        profileImage: profile.profileImgUrl || '/saesac.png'
      }));
    } catch (error) {
      console.error('강사 프로필 정보 가져오기 실패:', error);
    }
  }, [user]);

  const requestMyCourses = async (page = 1, size = coursesPerPage) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/courses/instructor/me?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("idToken")}`
          }
        }
      );
      console.log("myCourseList : " + res.data.myCourseList);
      setRecentCourses(res.data.myCourseList);
      setTotalPages(res.data.myCourseList.totalPages);

    } catch (error) {
      console.error(error);
    }
  }

  const formatMonth = (yearMonth) => {
    const [year, month] = yearMonth.split('-');
    const currentYear = new Date().getFullYear().toString();

    if (year === currentYear) {
      return `${parseInt(month)}월`;
    }

    return `${year}.${parseInt(month)}월`;
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        await fetchInstructorProfile();

        const data = await StatsService.getInstructorStats();
        console.log("Backend response:", data.statistics);

        // 월별 수익 데이터 가공
        const revenueChartData = data.statistics.monthlyRevenue.map(item => ({
          month: formatMonth(item.yearMonth),
          revenue: Number(item.revenue),
          yearMonth: item.yearMonth // 정렬용
        }));

        const stats = {
          totalStudents: data.statistics.totalStudents,
          totalCourses: data.statistics.activeCourses,
          totalRevenue: data.statistics.totalRevenue,
          averageRating: data.statistics.averageRating,
          monthlyRevenue: data.statistics.monthlyStats?.revenue || 0,
          totalStudentsTrend: data.statistics.totalStudentsTrend,
          monthlyRevenueTrend: data.statistics.monthlyRevenueTrend,
          averageRatingTrend: data.statistics.averageRatingTrend
        }

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

        setStats(stats);
        setRevenueData(revenueChartData);
        setQuizzes(mockQuizzes);

        requestMyCourses(currentPage, coursesPerPage);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRecentEnrollments = async () => {

      setIsLoading(true);
      await fetchInstructorProfile();

      const enrollmentData = await StatsService.getRecentEnrollments();

      setRecentEnrollments(enrollmentData);

    }

    const fetchRecentReviews = async () => {

      setIsLoading(true);
      await fetchInstructorProfile();

      const reviewData = await StatsService.getRecentReviews();

      setRecentReviews(reviewData);
    }

    fetchDashboardData();
    fetchRecentEnrollments();
    fetchRecentReviews();
  }, [currentPage, fetchInstructorProfile]);

  const handleManualUpdate = async () => {
    try {
      setIsLoading(true);
      await StatsService.manualUpdate();

      const data = await StatsService.getInstructorStats();

      const revenueChartData = data.statistics.monthlyRevenue.map(item => ({
        month: formatMonth(item.yearMonth),
        revenue: Number(item.revenue),
        yearMonth: item.yearMonth
      }))

      setStats({
        totalStudents: data.statistics.totalStudents,
        totalCourses: data.statistics.activeCourses,
        totalRevenue: data.statistics.totalRevenue,
        averageRating: data.statistics.averageRating,
        monthlyRevenue: data.statistics.monthlyStats?.revenue || 0,
        totalStudentsTrend: data.statistics.totalStudentsTrend,
        monthlyRevenueTrend: data.statistics.monthlyRevenueTrend,
        averageRatingTrend: data.statistics.averageRatingTrend
      });

      setRevenueData(revenueChartData);

      const enrollmentData = await StatsService.getRecentEnrollments();
      setRecentEnrollments(enrollmentData);

      await requestMyCourses(currentPage, coursesPerPage);

      toast.success('통계가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.log('통계 업데이트 실패: ', error);
      toast.error('통계 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
    requestMyCourses(page, coursesPerPage); // 페이지 변경 시 데이터 요청
  };

  const renderDashboardContent = () => (
    <div className="space-y-6">

      {/* 강사 프로필 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <img
            src={profileData.profileImage} // 기본 프로필 이미지 설정
            alt={profileData.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {profileData.name} {/* 이름이 없을 경우 기본 텍스트 */}
            </h1>
            <p className="text-gray-600">{profileData.bio}</p>
          </div>
          <Link
            to="/instructor/profile"
            className="ml-auto text-primary hover:text-primary-dark"
          >
            프로필 수정
          </Link>
        </div>

        {/* 추가 정보: 전문 분야, 소셜 링크 */}
        <div className="mt-6 space-y-4">
          {/* 전문 분야 */}
          <div>
            <h2 className="text-lg font-semibold">전문 분야</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.expertise.length > 0 ? (
                profileData.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">전문 분야가 아직 등록되지 않았습니다.</p>
              )}
            </div>
          </div>

          {/* 소셜 링크 */}
          <div>
            <h2 className="text-lg font-semibold mb-2">소셜 링크</h2>
            <div className="space-y-3">
              {/* Website */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  🌐 {/* Web Site 아이콘 */}
                </span>
                <span className="font-semibold w-24">Web Site</span>
                {profileData.socialLinks.website ? (
                  <a
                    href={profileData.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark flex-1 truncate"
                  >
                    {profileData.socialLinks.website}
                  </a>
                ) : (
                  <span className="text-gray-400 flex-1">https://www.my-website.com</span>
                )}
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                    alt="LinkedIn Icon"
                    className="w-5 h-5"
                  />
                </span>
                <span className="font-semibold w-24">LinkedIn</span>
                {profileData.socialLinks.linkedin ? (
                  <a
                    href={profileData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark flex-1 truncate"
                  >
                    {profileData.socialLinks.linkedin}
                  </a>
                ) : (
                  <span className="text-gray-400 flex-1">https://linkedin.com/example</span>
                )}
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center" >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt="GitHub Icon"
                    className="w-5 h-5"
                  />
                </span>
                <span className="font-semibold w-24">GitHub</span>
                {profileData.socialLinks.github ? (
                  <a
                    href={profileData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark flex-1 truncate"
                  >
                    {profileData.socialLinks.github}
                  </a>
                ) : (
                  <span className="text-gray-400 flex-1">https://github.com/example</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 수동 업데이트 버튼 추가 */}
        <div className="col-span-full flex justify-end mb-4">
          <button
            onClick={handleManualUpdate}
            disabled={isLoading}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? '업데이트 중...' : '통계 수동 업데이트'}
          </button>
        </div>
        {/* 총 수강생 */}
        <StatCard
          title="총 수강생"
          value={`${stats?.totalStudents || 0}명`}
          icon={<FiUsers />}
          trend={stats?.totalStudentsTrend?.new  // isNew 대신 new로 수정
            ? "NEW"
            : stats?.totalStudentsTrend?.trend !== 0
              ? `${stats.totalStudentsTrend.trend > 0 ? '+' : ''}${stats.totalStudentsTrend.trend}% ${stats.totalStudentsTrend.trendType === 'INCREASE' ? '증가' : '감소'}`
              : "변동 없음"}
        />
        {/* 운영 중인 강좌 */}
        <StatCard
          title="운영 중인 강좌"
          value={`${stats?.totalCourses || 0}개`}
          icon={<FiBookOpen />}
        />
        {/* 이번 달 수익 */}
        <StatCard
          title="이번 달 수익"
          value={`${stats?.monthlyRevenue?.toLocaleString() || 0}원`}
          icon={<FiDollarSign />}
          trend={stats?.monthlyRevenueTrend?.new  // isNew 대신 new로 수정
            ? "NEW"
            : stats?.monthlyRevenueTrend?.trend !== 0
              ? `${stats.monthlyRevenueTrend.trend > 0 ? '+' : ''}${stats.monthlyRevenueTrend.trend}% ${stats.monthlyRevenueTrend.trendType === 'INCREASE' ? '증가' : '감소'}`
              : "변동 없음"}
        />
        <StatCard
          title="평균 평점"
          value={`${stats?.averageRating?.toFixed(1) || 0}점`}
          icon={<FiStar />}
          trend={stats?.averageRatingTrend
            ? stats.averageRatingTrend.trend === 0
              ? "변동 없음"
              : `${stats.averageRatingTrend.trend > 0 ? '+' : ''}${stats.averageRatingTrend.trend.toFixed(1)} ${stats.averageRatingTrend.trendType === 'INCREASE' ? '상승' : '하락'}`
            : "변동 없음"}
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
                {/*<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
                {/*  수익*/}
                {/*</th>*/}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  진행률
                </th>
                {/*<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
                {/*  최근 업데이트*/}
                {/*</th>*/}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...recentCourses]
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // 최신 순으로 정렬
                .map(course => (
                  <tr key={course.id} className="cursor-pointer hover:bg-gray-100"
                    onClick={() => window.location.href = `/instructor/courses/${course.id}/content`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {course.enrollmentCount}명
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <FiStar className="text-yellow-400 mr-1" />
                        {course.averageRating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* pagination component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* 최근 활동 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 수강신청 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">최근 수강신청</h2>
          <div className="space-y-4">
            {recentEnrollments.length > 0 ? (
              recentEnrollments.map(enrollment => (
                <div
                  key={`enrollment-${enrollment.userId}-${enrollment.enrolledAt}`}
                  className="flex items-center space-x-4"
                >
                  <img
                    src="/default-profile.png"
                    alt={enrollment.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{enrollment.username}</p>
                    <p className="text-sm text-gray-500">{enrollment.courseName}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-500">
                최근 수강신청이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 최근 수강평 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">최근 수강평</h2>
          <div className="space-y-4">
            {recentReviews.length > 0 ? (
              recentReviews.map(review => (
                <div
                  key={`review-${review.id}`}
                  className="border-b pb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{review.writer}</span>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{review.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{review.courseName}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-500">
                최근 수강평이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );




  // 강좌 목록 출력 함수
  const renderCoursesContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">강좌 관리</h2>
        <Link
          to="/instructor/courses/create"
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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">수강생</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">평점</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody>
            {recentCourses.map(course => (
              <tr key={course.id} className="">
                <td className="px-6 py-4">
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => window.location.href = `/instructor/courses/${course.id}/content`}
                  >
                    {course.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">{course.enrollmentCount}명</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <FiStar className="text-yellow-400 mr-1" />
                    {course.averageRating.toFixed(1)}점
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`/instructor/courses/${course.id}/edit`}
                      className="text-primary hover:text-primary-dark"
                    >
                      수정
                    </Link>
                    <Link
                      to={`/instructor/courses/${course.id}/content`}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      콘텐츠
                    </Link>
                    <Link
                      to={`/instructor/courses/${course.id}/quiz`}
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

      {/* pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
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
      // setIsEditing(false);
    } catch (error) {
      toast.error('프로필 저장에 실패했습니다.');
    }
  };

  const renderProfileContent = () => (
    <ProfilePage />
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
              className={`pb-4 px-2 ${activeTab === tab.id
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
            <p className="text-xs flex items-center mt-1">
              <span className="text-gray-400 mr-1">전월대비</span>
              <span className={`flex items-center ${trend.includes("+") ? "text-green-500" :
                trend.includes("-") ? "text-red-500" :
                  "text-gray-500"
                }`}>
                {trend.includes("-") ? (
                  <FiTrendingDown className="mr-1 w-3 h-3" />
                ) : trend.includes("+") ? (
                  <FiTrendingUp className="mr-1 w-3 h-3" />
                ) : null}
                {trend}
              </span>
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