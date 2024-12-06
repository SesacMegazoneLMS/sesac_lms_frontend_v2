import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { apiEndpoints } from '../../infrastructure/api/endpoints';
import LoadingSpinner from '../../shared/components/common/LoadingSpinner';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  background: #ffffff;
`;

const Header = styled.header`
  background: #101113;
  padding: 2rem;
  color: white;
`;

const CourseTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Progress = styled.div`
  max-width: 600px;
`;

const ProgressBackground = styled.div`
  background: rgba(255, 255, 255, 0.1);
  height: 8px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  background: #00c471;
  width: ${props => props.width}%;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 120px);
  overflow: hidden;
`;

const Sidebar = styled.aside`
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  overflow-y: auto;
`;

const CurriculumList = styled.div`
  padding: 1rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const LessonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const LessonItem = styled.div`
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.active ? '#e9ecef' : 'transparent'};
  color: ${props => props.active ? '#228be6' : '#495057'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: #e9ecef;
  }

  ${props => props.completed && `
    &::after {
      content: '✓';
      color: #00c471;
      margin-left: 0.5rem;
    }
  `}
`;

const LessonTitle = styled.span`
  flex: 1;
`;

const LessonDuration = styled.span`
  font-size: 0.875rem;
  color: #868e96;
`;

const MainContent = styled.main`
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const VideoPlayer = styled.div`
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
  }
`;

const LessonInfo = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LessonDescription = styled.p`
  color: #495057;
  line-height: 1.6;
`;

const Materials = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const MaterialsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const MaterialsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MaterialItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const MaterialIcon = styled.span`
  color: #868e96;
`;

const MaterialTitle = styled.span`
  flex: 1;
`;

const DownloadButton = styled.a`
  padding: 0.5rem 1rem;
  background: #228be6;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  text-decoration: none;

  &:hover {
    background: #1c7ed6;
  }
`;

function CourseDashboard() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await apiEndpoints.courses.getById(parseInt(id, 10));
        setCourseData(data);
      } catch (error) {
        toast.error('강좌 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchCourseData();
  }, [id]);

  if (!courseData) return <LoadingSpinner />;

  return (
    <DashboardContainer>
      <Header>
        <CourseTitle>{courseData.title}</CourseTitle>
        <Progress>
          <ProgressBackground>
            <ProgressBar width={courseData.progress} />
          </ProgressBackground>
          <ProgressText>
            {courseData.currentLecture} / {courseData.totalLectures} 강의 완료 
            ({courseData.progress}%)
          </ProgressText>
        </Progress>
      </Header>

      <Content>
        <Sidebar>
          <CurriculumList>
            {courseData.curriculum.map((section, sIndex) => (
              <Section key={section.id}>
                <SectionTitle>{section.title}</SectionTitle>
                <LessonList>
                  {section.lessons.map((lesson, lIndex) => (
                    <LessonItem 
                      key={lesson.id}
                      active={currentSection === sIndex && currentLesson === lIndex}
                      completed={lesson.completed}
                      onClick={() => {
                        setCurrentSection(sIndex);
                        setCurrentLesson(lIndex);
                      }}
                    >
                      <LessonTitle>{lesson.title}</LessonTitle>
                      <LessonDuration>{lesson.duration}</LessonDuration>
                    </LessonItem>
                  ))}
                </LessonList>
              </Section>
            ))}
          </CurriculumList>
        </Sidebar>

        <MainContent>
          <VideoPlayer>
            <video
              src={courseData.curriculum[currentSection].lessons[currentLesson].videoUrl}
              controls
              width="100%"
            />
          </VideoPlayer>
          <LessonInfo>
            <LessonTitle>
              {courseData.curriculum[currentSection].lessons[currentLesson].title}
            </LessonTitle>
            <LessonDescription>
              {courseData.curriculum[currentSection].lessons[currentLesson].description}
            </LessonDescription>
          </LessonInfo>
          <Materials>
            <MaterialsTitle>학습 자료</MaterialsTitle>
            <MaterialsList>
              {courseData.curriculum[currentSection].lessons[currentLesson].materials?.map(material => (
                <MaterialItem key={material.id}>
                  <MaterialIcon>{material.type}</MaterialIcon>
                  <MaterialTitle>{material.title}</MaterialTitle>
                  <DownloadButton href={material.url}>다운로드</DownloadButton>
                </MaterialItem>
              ))}
            </MaterialsList>
          </Materials>
        </MainContent>
      </Content>
    </DashboardContainer>
  );
}

export default CourseDashboard;