import React from 'react';
import styled from 'styled-components';

export const CloseButton = ({ onClick }) => {
  return (
    <StyledCloseButton onClick={onClick}>
      &times;
    </StyledCloseButton>
  );
};

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #495057;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
    color: #212529;
  }
`;

export default CloseButton;
