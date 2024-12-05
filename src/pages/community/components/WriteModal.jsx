import React, { useState } from 'react';
import styled from 'styled-components';
import { useCommunity } from '../../../shared/hooks/UseCommunity';
import { CloseButton } from '../../../shared/components/common/CloseButton';
export const WriteModal = ({ show, onClose, onSubmit }) => {
  const { addPost } = useCommunity();
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: '질문'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postData);
    onClose();
  };

  if (!show) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>글쓰기</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalForm onSubmit={handleSubmit}>
          <Select
            value={postData.category}
            onChange={(e) => setPostData({...postData, category: e.target.value})}
          >
            <option value="질문">질문</option>
            <option value="정보">정보</option>
            <option value="스터디">스터디</option>
          </Select>
          <Input
            placeholder="제목"
            value={postData.title}
            onChange={(e) => setPostData({...postData, title: e.target.value})}
          />
          <TextArea
            placeholder="내용을 입력하세요"
            value={postData.content}
            onChange={(e) => setPostData({...postData, content: e.target.value})}
          />
          <SubmitButton type="submit">작성하기</SubmitButton>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    color: #212529;
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1971C2;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;
  min-height: 200px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #1971C2;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #1971C2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1864AB;
  }
`;