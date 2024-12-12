import React from 'react';
import styled from 'styled-components';

const InstructorContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InstructorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const InstructorInfo = styled.div`
  flex: 1;
`;

const InstructorName = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const InstructorTitle = styled.p`
  color: var(--text-light);
`;

const InstructorBio = styled.p`
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 1.5rem;
`;

const InstructorStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
`;

const StatItem = styled.div`
  span {
    display: block;
    &:first-child {
      font-weight: 600;
      font-size: var(--font-size-lg);
      color: var(--text);
    }
    &:last-child {
      font-size: var(--font-size-sm);
      color: var(--text-light);
    }
  }
`;

const InstructorSection = ({ instructor }) => {
  return (
    <InstructorContainer>
      <InstructorHeader>
        <ProfileImage src={instructor.profileImage} alt={instructor.name} />
        <InstructorInfo>
          <InstructorName>{instructor.name}</InstructorName>
          <InstructorTitle>{instructor.title}</InstructorTitle>
        </InstructorInfo>
      </InstructorHeader>
      
      <InstructorBio>{instructor.bio}</InstructorBio>
      
      <InstructorStats>
        <StatItem>
          <span>{instructor.totalStudents}</span>
          <span>수강생</span>
        </StatItem>
        <StatItem>
          <span>{instructor.totalCourses}</span>
          <span>강좌</span>
        </StatItem>
        <StatItem>
          <span>{instructor.rating.toFixed(1)}</span>
          <span>평점</span>
        </StatItem>
      </InstructorStats>
    </InstructorContainer>
  );
};

export default InstructorSection;