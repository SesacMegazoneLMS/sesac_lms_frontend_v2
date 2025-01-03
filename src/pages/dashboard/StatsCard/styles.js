import styled from 'styled-components';

export const StatsContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const StatsTitle = styled.h3`
  font-size: 1.125rem;
  color: #111827;
  margin-bottom: 1rem;
  font-weight: 600;
`;

export const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
`;

export const StatLabel = styled.span`
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const StatValue = styled.span`
  color: #111827;
  font-weight: 600;
  font-size: 1rem;
`;