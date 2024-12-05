import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CourseCard } from './CourseCard';
import { StatsCard } from './StatsCard';
import { QuizCard } from './QuizCard';
import { CourseSection } from './CourseSection';

function StudentDashboard() {
  const { user } = useSelector(state => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [learningHistory, setLearningHistory] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const coursesResponse = await fetch('/mock/db/courses.json');
        const coursesData = await coursesResponse.json();
        
        const enrollmentsResponse = await fetch('/mock/db/enrollments.json');
        const enrollmentsData = await enrollmentsResponse.json();
        
        const userEnrollments = enrollmentsData.enrollments.filter(
          enrollment => enrollment.userId === user?.id
        );
        
        const userCourses = userEnrollments.map(enrollment => {
          const courseInfo = coursesData.courses.find(
            course => course.id === enrollment.courseId
          );
          return {
            ...courseInfo,
            progress: enrollment.progress,
            lastAccessedLecture: enrollment.lastAccessedLecture,
            currentLecture: enrollment.lastAccessedLecture
          };
        });
        
        setEnrolledCourses(userCourses);
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };

    if (user?.id) {
      loadStudentData();
    }
  }, [user?.id]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardContainer>
      <Header>
        <h1>안녕하세요, {user?.name}님!</h1>
        <HeaderLinks>
          <StyledLink to="/profile">프로필 관리</StyledLink>
          <StyledLink to="/certificates">수료증 관리</StyledLink>
        </HeaderLinks>
      </Header>

      <MainContent>
        <CourseSection 
          courses={enrolledCourses}
          onViewAll={() => navigate('/my-courses')} 
        />
        <SideSection>
          <StatsCard 
            stats={{
              totalHours: 23,
              weeklyHours: 5,
              completedCourses: 3
            }} 
          />
          <QuizCard quizzes={upcomingQuizzes} />
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