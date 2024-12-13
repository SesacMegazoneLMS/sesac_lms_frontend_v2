import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { apiEndpoints } from '../../infrastructure/api/endpoints';
import { toast } from 'react-toastify';

function RoadmapDetailPage() {
  const { id } = useParams();
  const [roadmapData, setRoadmapData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        const data = await apiEndpoints.roadmaps.getById(id);
        setRoadmapData(data);
        
        // 로드맵에 포함된 강좌들 조회
        const coursesData = await Promise.all(
          data.courses.map(courseId => 
            apiEndpoints.courses.getById(courseId)
          )
        );
        setCourses(coursesData);
      } catch (error) {
        toast.error('로드맵 정보를 불러오는데 실패했습니다.');
      }
    };
    fetchRoadmapData();
  }, [id]);

  return (
    <PageContainer>
      <RoadmapHeader>
        <CategoryBadge>{roadmapData?.category}</CategoryBadge>
        <Title>{roadmapData?.title}</Title>
        <Description>{roadmapData?.description}</Description>
      </RoadmapHeader>

      <CourseList>
        {courses.map((course, index) => (
          <CourseCard key={course.id}>
            <StepNumber>{index + 1}단계</StepNumber>
            <CourseInfo>
              <CourseThumbnail src={course.thumbnail} />
              <CourseTitle>{course.title}</CourseTitle>
              <CourseLevel>{course.level}</CourseLevel>
              <CourseSkills>
                {course.skills.map(skill => (
                  <SkillBadge key={skill}>{skill}</SkillBadge>
                ))}
              </CourseSkills>
            </CourseInfo>
          </CourseCard>
        ))}
      </CourseList>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const RoadmapHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const CategoryBadge = styled.span`
  background: #e7f5ff;
  color: #228be6;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 1.5rem 0;
  color: #1a1a1a;
`;

const Description = styled.p`
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StepNumber = styled.div`
  background: #f8f9fa;
  color: #228be6;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  height: fit-content;
`;

const CourseInfo = styled.div`
  display: grid;
  gap: 1rem;
`;

const CourseThumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const CourseLevel = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const CourseSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillBadge = styled.span`
  background: #f1f3f5;
  color: #495057;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
`;

export default RoadmapDetailPage;