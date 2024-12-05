import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CardContainer = styled.div`
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
`;

export const CourseImage = styled.div`
  width: 294.66px;
  height: 191.53px;
  overflow: hidden;
  border-radius: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CourseInfo = styled.div`
  margin-top: 16px;
`;

export const CourseTitle = styled.h3`
  font-size: 15.25px;
  color: #212529;
  margin-bottom: 12px;
`;

export const ProgressBar = styled.div`
  margin: 12px 0;
`;

export const ProgressBackground = styled.div`
  background: #e9ecef;
  border-radius: 4px;
  height: 8px;
  width: 100%;
`;

export const Progress = styled.div`
  background: #00c471;
  height: 100%;
  width: ${props => props.width}%;
  border-radius: 4px;
`;

export const ProgressText = styled.div`
  font-size: 14px;
  color: #495057;
  margin-top: 4px;
  
  span {
    margin-right: 4px;
  }
`;

export const CourseActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

export const ContinueButton = styled(Link)`
  padding: 8px 16px;
  background: #00c471;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    background: #00b265;
  }
`;

export const MaterialsButton = styled(Link)`
  padding: 8px 16px;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

export const AddToCartButton = styled.button`
  padding: 8px 16px;
  background: #ffffff;
  color: #495057;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
  }
`;

export const CoursePrice = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #212529;
  margin: 8px 0;
`;

export const CourseInstructor = styled.p`
  font-size: 14px;
  color: #868e96;
  margin-bottom: 16px;
`;

export const ViewDetailButton = styled(Link)`
  padding: 8px 16px;
  background: #00c471;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    background: #00b265;
  }
`;