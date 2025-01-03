import React from 'react';
import {
  StatsContainer,
  StatsTitle,
  StatsList,
  StatItem,
  StatLabel,
  StatValue
} from './styles';

export const StatsCard = ({ enrolledCourses }) => {
  console.log('enrolledCourses:', enrolledCourses);

  const calculateStats = () => {
    let completedLectures = 0;
    let totalWatchTime = 0;

    enrolledCourses?.forEach(course => {
      console.log('Course:', course.title);
      console.log('Lectures:', course.lectures);

      course.lectures?.forEach(lecture => {
        console.log('Lecture status:', {
          title: lecture.title,
          completed: lecture.completed,
          status: lecture.status
        });

        if (lecture.completed === true) {
          completedLectures++;
          if (lecture.duration) {
            const [hours = 0, minutes = 0] = lecture.duration.split(':').map(Number);
            totalWatchTime += hours + (minutes / 60);
          }
        }
      });
    });

    console.log('Calculated stats:', { completedLectures, totalWatchTime });

    return {
      totalHours: Math.floor(totalWatchTime),
      completedLectures
    };
  };

  const stats = calculateStats();

  return (
    <StatsContainer>
      <StatsTitle>나의 학습 통계</StatsTitle>
      <StatsList>
        <StatItem>
          <StatLabel>총 학습시간</StatLabel>
          <StatValue>{stats.totalHours}시간</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>완료한 강의</StatLabel>
          <StatValue>{stats.completedLectures}개</StatValue>
        </StatItem>
      </StatsList>
    </StatsContainer>
  );
};