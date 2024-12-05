import styled from 'styled-components';

export const CourseSectionContainer = styled.div`
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  color: #212529;
  font-weight: 600;
`;

export const CourseCount = styled.span`
  color: #868e96;
  font-size: 14px;
`;

export const CourseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmptyCourses = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #868e96;
  
  p {
    margin-top: 8px;
    font-size: 14px;
  }
`;

export const ViewAllButton = styled.button`
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;