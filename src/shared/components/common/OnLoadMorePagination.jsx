import React from 'react';
import styled from 'styled-components';

export const OnLoadMorePagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <PaginationWrapper>
            <LoadMoreButton onClick={onPageChange} disabled={currentPage === totalPages || totalPages === 0}>
                더보기
            </LoadMoreButton>
        </PaginationWrapper>
    );
};

const LoadMoreButton = styled.button`
  padding: 10px 20px; /* 패딩 조정 */
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background-color: white;
  color: ${props => props.disabled ? '#adb5bd' : '#1971C2'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  width: calc(100% - 16px); /* MainContent보다 조금 작게 설정 */
  max-width: 300px; /* 최대 너비 설정 (필요에 따라 조정 가능) */
  
  &:hover {
    background-color: ${props => props.disabled ? 'white' : '#e7f5ff'};
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

export default OnLoadMorePagination;