import React from 'react';
import { StatsContainer, StatsTitle, StatsList, StatItem, StatLabel, StatValue } from './styles';
import { FiBook, FiCheck, FiTrendingUp } from 'react-icons/fi';

export const StatsCard = ({ enrolledCourses }) => {
  // 전체 진행률 계산
  const calculateOverallProgress = () => {
    if (!enrolledCourses || enrolledCourses.length === 0) return 0;

    const totalProgress = enrolledCourses.reduce((sum, course) => {
      return sum + (course.progressRate || 0);
    }, 0);

    return Math.round(totalProgress / enrolledCourses.length);
  };

  // 완료된 강좌 수 계산
  const completedCourses = enrolledCourses.filter(course => course.progressRate === 100).length;

  return (
    <StatsContainer>
      <StatsTitle>나의 학습 통계</StatsTitle>
      <StatsList>
        <StatItem>
          <div className="flex items-center gap-2">
            <FiBook className="text-blue-600" />
            <StatLabel>수강 중인 강좌</StatLabel>
          </div>
          <StatValue>{enrolledCourses.length}개</StatValue>
        </StatItem>

        <StatItem>
          <div className="flex items-center gap-2">
            <FiTrendingUp className="text-blue-600" />
            <StatLabel>전체 진행률</StatLabel>
          </div>
          <div className="flex items-center gap-2">
            <StatValue>{calculateOverallProgress()}%</StatValue>
            <div className="w-20 h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${calculateOverallProgress()}%` }}
              />
            </div>
          </div>
        </StatItem>

        <StatItem>
          <div className="flex items-center gap-2">
            <FiCheck className="text-blue-600" />
            <StatLabel>완료한 강좌</StatLabel>
          </div>
          <StatValue>{completedCourses}개</StatValue>
        </StatItem>
      </StatsList>
    </StatsContainer>
  );
};