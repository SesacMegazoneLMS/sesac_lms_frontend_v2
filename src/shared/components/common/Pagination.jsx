import React from 'react';
import styled from 'styled-components';

// 페이지네이션 컴포넌트
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

// 액션 버튼 컴포넌트들
export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
`;

export const AddToCartButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
  }
`;

export const EnrollButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #1971C2;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #1864AB;
  }
`;

// 페이지네이션 스타일 컴포넌트
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