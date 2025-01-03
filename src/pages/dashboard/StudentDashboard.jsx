import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CourseCard } from '../../shared/components/CourseCard';
import { StatsCard } from './StatsCard';
import { QuizCard } from './QuizCard';
import { CourseSection } from './CourseSection';
import { userService } from '../../infrastructure/services/CourseService';
import axios from 'axios';

function StudentDashboard() {
  const { user, loading } = useSelector(state => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const { enrollments } = await userService.getMyEnrollments();

        // 각 강좌의 진행률 정보를 가져오기
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment) => {
            try {
              const progressResponse = await axios.get(
                `${process.env.REACT_APP_BACKEND_API_URL}/api/courses/${enrollment.courseId}/progress`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('idToken')}`
                  }
                }
              );

              return {
                id: enrollment.courseId,
                title: enrollment.title,
                thumbnail: enrollment.thumbnail,
                category: enrollment.category,
                level: enrollment.level,
                description: enrollment.description,
                completedLectures: progressResponse.data.completedLectures,
                totalLectures: progressResponse.data.totalLectures,
                progressRate: progressResponse.data.progressRate,
                isCompleted: progressResponse.data.progressRate === 100
              };
            } catch (error) {
              console.error(`Error fetching progress for course ${enrollment.courseId}:`, error);
              return enrollment;
            }
          })
        );

        console.log('Courses with progress:', coursesWithProgress);
        setEnrolledCourses(coursesWithProgress);
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };

    if (user) {
      loadStudentData();
    }
  }, [user]);

  // 로딩 중일 때 표시
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>안녕하세요, {user?.name}님!</h1>
        <HeaderLinks>
          <StyledLink to="/profile">프로필 관리</StyledLink>
          {/* <StyledLink to="/certificates">수료증 관리</StyledLink> */}
        </HeaderLinks>
      </Header>

      <MainContent>
        <CoursesSection>
          <CourseSection
            courses={enrolledCourses}
            onViewAll={() => navigate('/my-courses')}
            title="수강 중인 강좌"
          />
        </CoursesSection>
        <SideSection>
          <StatsCard enrolledCourses={enrolledCourses} />
          {/* <QuizCard quizzes={[]} /> */}
        </SideSection>
      </MainContent>
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: bold;
  }
`;

const HeaderLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const StyledLink = styled(Link)`
  color: #00c471;
  text-decoration: none;
  
  &:hover {
    color: #00b265;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
`;

const CoursesSection = styled.div``;

const SideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default StudentDashboard;