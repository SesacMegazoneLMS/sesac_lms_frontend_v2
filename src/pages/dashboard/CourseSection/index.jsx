import React from 'react';
import CourseCard from '../../../shared/components/CourseCard';
import {
  CourseSectionContainer,
  SectionHeader,
  SectionTitle,
  CourseCount,
  CourseList,
  EmptyCourses,
  ViewAllButton
} from './styles';

export const CourseSection = ({ courses, onViewAll, title, type = 'enrolled' }) => {
  return (
    <CourseSectionContainer>
      <SectionHeader>
        <div>
          <SectionTitle>{title}</SectionTitle>
          <CourseCount>{courses.length}개의 강좌</CourseCount>
        </div>
        {courses.length > 0 && (
          <ViewAllButton onClick={onViewAll}>
            전체 보기
          </ViewAllButton>
        )}
      </SectionHeader>

      <CourseList>
        {courses.length > 0 ? (
          courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              type={type}
            />
          ))
        ) : (
          <EmptyCourses>
            <img
              src="/assets/icons/empty-course.svg"
              alt="강좌 없음"
            />
            <p>강좌가 없습니다.</p>
          </EmptyCourses>
        )}
      </CourseList>
    </CourseSectionContainer>
  );
};