import React from 'react';
import styled from 'styled-components';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PaginationWrapper>
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </PageButton>
      
      {pages.map(page => (
        <PageNumber
          key={page}
          active={currentPage === page}
          onClick={() => onPageChange(page)}
        >
          {page}
        </PageNumber>
      ))}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </PageButton>
    </PaginationWrapper>
  );
};

// Styled Components
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 24px 0;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  color: ${props => props.disabled ? '#adb5bd' : '#1971C2'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.disabled ? 'white' : '#e7f5ff'};
  }
`;

const PageNumber = styled.button`
  padding: 8px 12px;
  border: 1px solid ${props => props.active ? '#1971C2' : '#dee2e6'};
  border-radius: 4px;
  background-color: ${props => props.active ? '#1971C2' : 'white'};
  color: ${props => props.active ? 'white' : '#495057'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? '#1864AB' : '#e7f5ff'};
    border-color: ${props => props.active ? '#1864AB' : '#1971C2'};
    color: ${props => props.active ? 'white' : '#1971C2'};
  }
`;

export default Pagination;