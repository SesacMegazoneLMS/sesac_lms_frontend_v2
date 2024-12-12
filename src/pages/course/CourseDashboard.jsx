import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiEndpoints } from '../../infrastructure/api/endpoints';
import { LoadingSpinner } from '../../shared/components/common/LoadingSpinner';
import VideoPlayer from '../../shared/components/VideoPlayer';
import styled from 'styled-components';

export const DashboardContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  background: #ffffff;
`;

export const Header = styled.header`
  background: #101113;
  padding: 2rem;
  color: white;
`;

export const CourseTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

export const Progress = styled.div`
  max-width: 600px;
`;

export const ProgressBackground = styled.div`
  background: rgba(255, 255, 255, 0.1);
  height: 8px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

export const ProgressBar = styled.div`
  background: var(--secondary);
  width: ${props => props.width}%;
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 120px);
  overflow: hidden;
`;

export const MainContent = styled.main`
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const VideoSection = styled.div`
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
`;

export const LessonInfo = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const LessonTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text);
`;

export const LessonDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`;

export const Sidebar = styled.aside`
  background: var(--background);
  border-right: 1px solid var(--border);
  overflow-y: auto;
`;

export const CurriculumList = styled.div`
  padding: 1rem;
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const SectionProgress = styled.span`
  font-size: 0.875rem;
  color: var(--text-light);
`;

export const LessonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const LessonItem = styled.div`
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  background: ${props => props.active ? '#e9ecef' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #e9ecef;
  }
`;

export const LessonStatus = styled.span`
  color: var(--secondary);
  font-size: 1rem;
  width: 20px;
  text-align: center;
`;

export const LessonDuration = styled.span`
  font-size: 0.875rem;
  color: var(--text-light);
  margin-left: auto;
`;

function CourseDashboard() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await apiEndpoints.courses.getById(parseInt(id, 10));
        setCourseData(data);
        // 마지막 학습 위치 불러오기
        const lastPosition = await apiEndpoints.courses.getLastPosition(id);
        if (lastPosition) {
          setCurrentSection(lastPosition.sectionIndex);
          setCurrentLesson(lastPosition.lessonIndex);
          setCurrentVideo(lastPosition.videoUrl);
        } else {
          // 처음 시작하는 경우 첫 강의 설정
          setCurrentVideo(data.lectures[0]?.videoUrl);
        }
      } catch (error) {
        toast.error('강좌 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const handleLessonClick = async (sectionIndex, lessonIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentLesson(lessonIndex);
    const video = courseData.lectures[sectionIndex]?.lessons[lessonIndex]?.videoUrl;
    setCurrentVideo(video);
    
    // 학습 진도 저장
    try {
      await apiEndpoints.courses.saveProgress({
        courseId: id,
        sectionIndex,
        lessonIndex,
        completed: true
      });
    } catch (error) {
      toast.error('진도 저장에 실패했습니다.');
    }
  };

  const handleLessonComplete = async (sectionIndex, lessonIndex) => {
    try {
      await apiEndpoints.courses.saveProgress({
        courseId: id,
        sectionIndex,
        lessonIndex,
        completed: true
      });
      
      // 로컬 상태 업데이트
      const updatedCourseData = { ...courseData };
      updatedCourseData.lectures[sectionIndex].lessons[lessonIndex].completed = true;
      updatedCourseData.completedLectures += 1;
      updatedCourseData.progress = Math.round(
        (updatedCourseData.completedLectures / updatedCourseData.totalLectures) * 100
      );
      setCourseData(updatedCourseData);
      
      toast.success('진도가 저장되었습니다.');
    } catch (error) {
      toast.error('진도 저장에 실패했습니다.');
    }
  };

  if (isLoading || !courseData) return <LoadingSpinner />;

  return (
    <DashboardContainer>
      <Header>
        <CourseTitle>{courseData.title}</CourseTitle>
        <Progress>
          <ProgressBackground>
            <ProgressBar width={courseData.progress} />
          </ProgressBackground>
          <ProgressText>
            {courseData.completedLectures} / {courseData.totalLectures} 강의 완료 
            ({courseData.progress}%)
          </ProgressText>
        </Progress>
      </Header>

      <Content>
        <MainContent>
          {currentVideo && (
            <VideoSection>
              <VideoPlayer 
                url={currentVideo}
                onProgress={async (progress) => {
                  if (progress >= 0.9) { // 90% 이상 시청 시 완료 처리
                    await handleLessonComplete(currentSection, currentLesson);
                  }
                }}
              />
            </VideoSection>
          )}
          <LessonInfo>
            <LessonTitle>
              {courseData.lectures[currentSection]?.lessons[currentLesson]?.title}
            </LessonTitle>
            <LessonDescription>
              {courseData.lectures[currentSection]?.lessons[currentLesson]?.description}
            </LessonDescription>
          </LessonInfo>
        </MainContent>

        <Sidebar>
          <CurriculumList>
            {courseData.lectures.map((section, sIndex) => (
              <Section key={section.id}>
                <SectionTitle>
                  {section.title}
                  <SectionProgress>
                    {section.completedLessons}/{section.lessons.length}
                  </SectionProgress>
                </SectionTitle>
                <LessonList>
                  {section.lessons.map((lesson, lIndex) => (
                    <LessonItem 
                      key={lesson.id}
                      active={currentSection === sIndex && currentLesson === lIndex}
                      completed={lesson.completed}
                      onClick={() => handleLessonClick(sIndex, lIndex)}
                    >
                      <LessonStatus>
                        {lesson.completed ? '✓' : ''}
                      </LessonStatus>
                      <LessonTitle>{lesson.title}</LessonTitle>
                      <LessonDuration>{lesson.duration}</LessonDuration>
                    </LessonItem>
                  ))}
                </LessonList>
              </Section>
            ))}
          </CurriculumList>
        </Sidebar>
      </Content>
    </DashboardContainer>
  );
}

export default CourseDashboard;