import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import {LoadingSpinner} from '../../shared/components/common/LoadingSpinner';
import {addToCart} from '../../store/slices/cartSlice';
import {CourseService} from '../../infrastructure/services/CourseService';
import CourseDetailTabs from './components/CourseDetailTabs';
import InstructorSection from './components/InstructorSection';
import {ActionButtons, AddToCartButton, EnrollButton} from '../../shared/components/common/Pagination';
import {reviewService} from "../../infrastructure/services/ReviewService";
import OnLoadMorePagination from "../../shared/components/common/OnLoadMorePagination";
import { useCallback } from "react";

function CourseDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]); // 리뷰 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수 상태 추가
  const [activeTab, setActiveTab] = useState('curriculum');
  const [relatedRoadmaps, setRelatedRoadmaps] = useState([]);
  const [message, setMessage] = useState('');

  const fetchCourseData = useCallback(async () => {
    try {
      const courseData = await CourseService.getCourseById(parseInt(id));
      const reviewData = await reviewService.getReviewsByCourse(parseInt(id), currentPage);

      setCourse(courseData);
      setReviews(prevReviews => [...prevReviews, ...reviewData.reviews]);
      setTotalPages(reviewData.totalPages);
      setMessage(reviewData.message);
    } catch (error) {
      toast.error('강좌 정보를 불러오는데 실패했습니다.');
    }
  }, [id, currentPage]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleAddToCart = () => {
    if (!course) return;
    
    dispatch(addToCart({
      courseId: course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      thumbnail: course.thumbnail
    }));

    toast.success('장바구니에 추가되었습니다.');
  };

  const handleLoadMore = () => {
    console.log(totalPages)
    if (currentPage < totalPages) {
      // 페이지를 증가시키고 데이터를 불러오는 로직
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleLike = async (reviewId) => {
    const likeStatus = await reviewService.getLikeStatus(reviewId);
    console.log("like : " + likeStatus);
    console.log("course : " + course);
  };

  // if (!course || !course.id) return <LoadingSpinner />;

  return (
      !course ? (<LoadingSpinner/>) :
    <PageContainer>
      <MainContent>
        <CourseInfoSection>
          <CourseHeader>
            <CategoryBadge>{course.category}</CategoryBadge>
            <CourseTitle>{course.title}</CourseTitle>
            <Description>{course.description}</Description>
          </CourseHeader>

          <RelatedRoadmaps>
            {relatedRoadmaps.map(roadmap => (
              <RoadmapCard key={roadmap.id}>
                <RoadmapThumbnail src={roadmap.thumbnail} alt={roadmap.title} />
                <RoadmapInfo>
                  <RoadmapTitle>{roadmap.title}</RoadmapTitle>
                  <RoadmapDescription>{roadmap.description}</RoadmapDescription>
                  <SkillTags>
                    {roadmap.skills.map(skill => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </SkillTags>
                </RoadmapInfo>
              </RoadmapCard>
            ))}
          </RelatedRoadmaps>

          <ActionButtons>
            <AddToCartButton onClick={handleAddToCart}>
              장바구니에 담기
            </AddToCartButton>
            <EnrollButton onClick={() => navigate(`/checkout/${course.id}`)}>
              바로 수강신청
            </EnrollButton>
          </ActionButtons>

          <CourseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'curriculum' && (
            <>
              <ObjectivesSection>
                <SectionTitle>학습 목표</SectionTitle>
                <ObjectivesList>
                  {course.objectives.map((objective, index) => (
                    <ObjectiveItem key={index}>{objective}</ObjectiveItem>
                  ))}
                </ObjectivesList>
              </ObjectivesSection>

              <RequirementsSection>
                <SectionTitle>수강 전 필요한 것들</SectionTitle>
                <RequirementsList>
                  {course.requirements.map((req, index) => (
                    <RequirementItem key={index}>{req}</RequirementItem>
                  ))}
                </RequirementsList>
              </RequirementsSection>

              <SkillsSection>
                <SectionTitle>배울 수 있는 기술</SectionTitle>
                <SkillsList>
                  {course.skills.map((skill, index) => (
                    <SkillTag key={index}>{skill}</SkillTag>
                  ))}
                </SkillsList>
              </SkillsSection>

              <CurriculumSection>
                <SectionTitle>커리큘럼</SectionTitle>
                <LectureList>
                  {course.lectures.map((lecture) => (
                    <LectureItem key={lecture.id}>
                      <LectureTitle>{lecture.title}</LectureTitle>
                    </LectureItem>
                  ))}
                </LectureList>
              </CurriculumSection>
            </>
          )}

          {activeTab === 'reviews' && (
              <ReviewsSection>
                <SectionTitle>수강평</SectionTitle>
                <ObjectivesList>
                  {reviews.length === 0 ? (
                      <div>{message}</div>
                  ) : (
                      reviews.map(review => (
                          <ObjectiveItem key={review.id}>
                            <ReviewWriter>{review.writer}</ReviewWriter>
                            <ReviewContent>{review.content}</ReviewContent>
                            <ReviewRating>
                              {'★'.repeat(review.rating)}{' '}
                              {'☆'.repeat(5 - review.rating)} {/* 5점 만점으로 별 표시 */}
                            </ReviewRating>
                            <LikeButton onClick={() => handleLike(review.id)}>
                              좋아요
                            </LikeButton>
                            {/* 좋아요 수 표시 */}
                            <LikeCount>{review.likesCount}</LikeCount>
                          </ObjectiveItem>
                      ))
                  )}
                </ObjectivesList>
                <OnLoadMorePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handleLoadMore}
                />
              </ReviewsSection>
          )}

          {activeTab === 'instructor' && (
            <InstructorSection instructor={course.user} />
          )}
        </CourseInfoSection>

        <PurchaseSection>
          <PurchaseCard>
            <PreviewImage src={course.thumbnail} alt={course.title} />
            <PriceInfo>
              <CurrentPrice>₩{course.price.toLocaleString()}</CurrentPrice>
              <ButtonGroup>
                <CartButton onClick={handleAddToCart}>장바구니에 담기</CartButton>
                <BuyButton onClick={() => navigate('/cart')}>바로 구매하기</BuyButton>
              </ButtonGroup>
            </PriceInfo>
          </PurchaseCard>
        </PurchaseSection>
      </MainContent>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CourseInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CourseHeader = styled.div`
  margin-bottom: 2rem;
`;

const CategoryBadge = styled.span`
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  margin-right: 0.5rem;
`;

const LevelBadge = styled(CategoryBadge)`
  background: var(--secondary);
`;

const CourseTitle = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: bold;
  margin: 1rem 0;
`;

const Description = styled.p`
  color: var(--text-light);
  line-height: 1.6;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StarIcon = styled.span`
  color: #ffd700;
`;

const StudentCount = styled.span`
  color: var(--text-light);
`;

const LastUpdate = styled.span`
  color: var(--text-light);
`;

const RelatedRoadmaps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RoadmapCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--background);
  border-radius: var(--radius-md);
`;

const RoadmapThumbnail = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-sm);
`;

const RoadmapInfo = styled.div`
  flex: 1;
`;

const RoadmapTitle = styled.h3`
  font-size: var(--font-size-lg);
  margin-bottom: 0.5rem;
`;

const RoadmapDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 0.5rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ObjectivesList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ObjectiveItem = styled.li`
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  
  &:before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--secondary);
  }
`;

const RequirementsList = styled(ObjectivesList)``;
const RequirementItem = styled(ObjectiveItem)``;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  background: var(--background);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
`;

const LectureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LectureItem = styled.div`
  padding: 1rem;
  background: var(--background);
  border-radius: var(--radius-md);
  cursor: pointer;
  
  &:hover {
    background: var(--border);
  }
`;

const LectureTitle = styled.h3`
  font-size: var(--font-size-base);
`;

const PurchaseSection = styled.div`
  position: sticky;
  top: 2rem;
`;

const PurchaseCard = styled.div`
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PriceInfo = styled.div`
  padding: 1.5rem;
`;

const CurrentPrice = styled.div`
  font-size: var(--font-size-2xl);
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: white;
  border: 2px solid var(--primary);
  color: var(--primary);
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: var(--background);
  }
`;

const BuyButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: var(--primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: var(--primary-dark);
  }
`;

const ObjectivesSection = styled.section`
  margin-bottom: 2rem;
`;

const RequirementsSection = styled.section`
  margin-bottom: 2rem;
`;

const SkillsSection = styled.section`
  margin-bottom: 2rem;
`;

const CurriculumSection = styled.section`
  margin-bottom: 2rem;
`;

const ReviewsSection = styled.section`
  margin-bottom: 2rem;
`;

const ReviewWriter = styled.div`
  font-weight: bold;
  color: #007bff;
`;

const ReviewContent = styled.p`
  margin: 5px 0;
  color: #555;
`;

const ReviewRating = styled.div`
  margin-top: 5px;
  color: #ffcc00; // Gold color for rating stars
`;

const LikeButton = styled.button`
    background-color: #ff6b6b; /* 좋아요 버튼 배경색 */
    color: white; /* 글자색 */
    border: none; /* 테두리 없음 */
    border-radius: 5px; /* 모서리 둥글게 */
    padding: 10px 15px; /* 패딩 */
    cursor: pointer; /* 커서 모양 변경 */
    font-size: 16px; /* 글자 크기 */
    transition: background-color 0.3s; /* 배경색 변화 애니메이션 */

    &:hover {
        background-color: #ff4d4d; /* 호버 시 배경색 변화 */
    }

    &:active {
        background-color: #ff1a1a; /* 클릭 시 배경색 변화 */
    }
`;

const LikeCount = styled.span`
    margin-left: 10px; /* 버튼과의 간격 */
    font-size: 16px; /* 글자 크기 */
    color: #333; /* 글자색 */
`;

export default CourseDetailPage;