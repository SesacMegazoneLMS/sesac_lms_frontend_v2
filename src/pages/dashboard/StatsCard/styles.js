import styled from 'styled-components';

export const StatsContainer = styled.div`
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
`;

export const StatsTitle = styled.h3`
  font-size: 18px;
  color: #212529;
  margin-bottom: 16px;
  font-weight: 600;
`;

export const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f5;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const StatLabel = styled.span`
  color: #495057;
  font-size: 14px;
`;

export const StatValue = styled.span`
  color: #212529;
  font-weight: 600;
  font-size: 14px;
`;