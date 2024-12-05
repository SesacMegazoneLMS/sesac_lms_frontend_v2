import React from 'react';
import {
  QuizContainer,
  QuizTitle,
  QuizList,
  QuizItem,
  QuizInfo,
  QuizName,
  QuizDate,
  QuizButton
} from './styles';

export const QuizCard = ({ quizzes }) => {
  return (
    <QuizContainer>
      <QuizTitle>예정된 퀴즈/과제</QuizTitle>
      <QuizList>
        {quizzes.map(quiz => (
          <QuizItem key={quiz.id}>
            <QuizInfo>
              <QuizName>{quiz.title}</QuizName>
              <QuizDate>{quiz.dueDate}</QuizDate>
            </QuizInfo>
            <QuizButton to={`/quiz/${quiz.id}`}>
              응시하기
            </QuizButton>
          </QuizItem>
        ))}
        {quizzes.length === 0 && (
          <QuizItem>
            <QuizInfo>
              <QuizName>예정된 퀴즈가 없습니다.</QuizName>
            </QuizInfo>
          </QuizItem>
        )}
      </QuizList>
    </QuizContainer>
  );
};