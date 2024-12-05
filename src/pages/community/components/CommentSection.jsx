import React, { useState } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../shared/utils/dateUtils';
import { useCommunity } from '../../../shared/hooks/UseCommunity';

export const CommentSection = ({ postId, comments = [] }) => {
  const { addComment } = useCommunity();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    await addComment(postId, {
      content: newComment,
      userId: '1', // 임시 userId
    });
    setNewComment('');
  };

  return (
    <CommentsWrapper>
      <CommentList>
        {Array.isArray(comments) && comments.map(comment => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <UserInfo>
                <UserAvatar>
                  {String(comment.userId || '익명').substring(0, 2)}
                </UserAvatar>
                <UserName>사용자 {comment.userId || '익명'}</UserName>
              </UserInfo>
              <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
            <CommentActionsWrapper>
              <InteractionButton>
                좋아요 {comment.likes || 0}
              </InteractionButton>
            </CommentActionsWrapper>
          </CommentItem>
        ))}
      </CommentList>
      <CommentForm onSubmit={handleSubmit}>
        <CommentInput
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <CommentButton type="submit">등록</CommentButton>
      </CommentForm>
    </CommentsWrapper>
  );
};

// Styled Components
const CommentsWrapper = styled.div`
  margin-top: 24px;
  border-top: 1px solid #dee2e6;
  padding-top: 24px;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #495057;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #495057;
`;

const CommentDate = styled.span`
  color: #868e96;
  font-size: 14px;
`;

const CommentContent = styled.p`
  color: #495057;
  margin: 0;
  line-height: 1.5;
`;

const CommentActionsWrapper = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 8px;
`;

const InteractionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: transparent;
  color: #495057;
  border: none;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    color: #1971C2;
  }
`;

const CommentForm = styled.form`
  margin-top: 24px;
  display: flex;
  gap: 8px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1971C2;
  }
`;

const CommentButton = styled.button`
  padding: 0 24px;
  background-color: #1971C2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1864AB;
  }
`;

export default CommentSection;