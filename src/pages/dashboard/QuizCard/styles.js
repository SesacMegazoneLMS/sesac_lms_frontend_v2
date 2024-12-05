import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const QuizContainer = styled.div`
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 24px;
`;

export const QuizTitle = styled.h3`
  font-size: 18px;
  color: #212529;
  margin-bottom: 16px;
  font-weight: 600;
`;

export const QuizList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const QuizItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

export const QuizInfo = styled.div`
  flex: 1;
`;

export const QuizName = styled.h4`
  font-size: 14px;
  color: #212529;
  margin-bottom: 4px;
`;

export const QuizDate = styled.span`
  font-size: 12px;
  color: #868e96;
`;

export const QuizButton = styled(Link)`
  padding: 6px 12px;
  background: #1971C2;
  color: white;
  border-radius: 4px;
  font-size: 14px;
  text-decoration: none;
  
  &:hover {
    background: #1864AB;
  }
`;