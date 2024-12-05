import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CardContainer,
  CourseImage,
  CourseInfo,
  CourseTitle,
  ProgressBar,
  ProgressBackground,
  Progress,
  ProgressText,
  CourseActions,
  ContinueButton,
  MaterialsButton,
  AddToCartButton,
  CoursePrice,
  CourseInstructor,
  ViewDetailButton
} from './styles';
import { addToCart } from '../../../store/slices/cartSlice';

export const CourseCard = ({ course, type = 'course' }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isEnrolled = type === 'enrolled';

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      thumbnail: course.thumbnail
    }));
  };

  return (
    <CardContainer>
      <CourseImage>
        <img src={course.thumbnail} alt={course.title} />
      </CourseImage>
      <CourseInfo>
        <CourseTitle>{course.title}</CourseTitle>
        {isEnrolled ? (
          <>
            <ProgressBar>
              <ProgressBackground>
                <Progress width={course.progress} />
              </ProgressBackground>
              <ProgressText>
                <span>{course.currentLecture}</span>
                <span>/ {course.totalLectures}강</span>
                <span>({course.progress}%)</span>
              </ProgressText>
            </ProgressBar>
            <CourseActions>
              <ContinueButton to={`/course/${course.id}/learn`}>
                이어서 학습하기
              </ContinueButton>
              <MaterialsButton to={`/course/${course.id}/materials`}>
                학습자료
              </MaterialsButton>
            </CourseActions>
          </>
        ) : (
          <>
            <CoursePrice>₩{course.price?.toLocaleString()}</CoursePrice>
            <CourseInstructor>{course.instructor}</CourseInstructor>
            <CourseActions>
              <ViewDetailButton to={`/course/${course.id}`}>
                강좌 상세보기
              </ViewDetailButton>
              <AddToCartButton onClick={handleAddToCart}>
                장바구니 담기
              </AddToCartButton>
            </CourseActions>
          </>
        )}
      </CourseInfo>
    </CardContainer>
  );
};