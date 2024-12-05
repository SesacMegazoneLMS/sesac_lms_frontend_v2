import React from 'react';
import {
  StatsContainer,
  StatsTitle,
  StatsList,
  StatItem,
  StatLabel,
  StatValue
} from './styles';

export const StatsCard = ({ stats }) => {
  return (
    <StatsContainer>
      <StatsTitle>나의 학습 통계</StatsTitle>
      <StatsList>
        <StatItem>
          <StatLabel>총 학습시간</StatLabel>
          <StatValue>{stats.totalHours}시간</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>이번 주 학습</StatLabel>
          <StatValue>{stats.weeklyHours}시간</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>완료한 강좌</StatLabel>
          <StatValue>{stats.completedCourses}개</StatValue>
        </StatItem>
      </StatsList>
    </StatsContainer>
  );
};