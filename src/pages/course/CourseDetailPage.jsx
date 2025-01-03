import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import {LoadingSpinner} from '../../shared/components/common/LoadingSpinner';
import {CourseService} from '../../infrastructure/services/CourseService';
import CourseDetailTabs from './components/CourseDetailTabs';
import InstructorSection from './components/InstructorSection';
import {AddToCartButton, EnrollButton, Pagination} from '../../shared/components/common/Pagination';
import {reviewService} from "../../infrastructure/services/ReviewService";
import OnLoadMorePagination from "../../shared/components/common/OnLoadMorePagination";
import {getCourseImage} from "../../shared/utils/imageUtils";
import {cartService} from "../../infrastructure/services/CartService"; // import
import 'react-quill/dist/quill.snow.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart} from '@fortawesome/free-solid-svg-icons';
import {useSelector} from "react-redux";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [message, setMessage] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const user = localStorage.getItem( 'idToken' );
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(1);
  const selectRef = useRef(null);
  const [ratingWidth, setRatingWidth] = useState('6rem');
  const userInfo = useSelector((state) => state.auth);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewContent, setEditReviewContent] = useState('');
  const [editReviewRating, setEditReviewRating] = useState(1);
  const [editRatingWidth, setEditRatingWidth] = useState('6rem');


  const fetchCourseData = useCallback(async () => {
    try {
      const courseData = await CourseService.getCourseById(parseInt(id));
      const reviewData = await reviewService.getReviewsByCourse(parseInt(id), currentPage);

      setCourse(courseData);
      setReviews(reviewData.reviews);
      setTotalPages(reviewData.totalPages);
      setMessage(reviewData.message);

      // 강의 이미지 로직 추가
      setCourseImage(getCourseImage(courseData));

    } catch (error) {
      toast.error('강좌 정보를 불러오는데 실패했습니다.');
    }
  }, [id, currentPage]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleAddToCart = async (user, course) => {
    try{
      const res = await cartService.addToCart( user, course.id );
      if (res.success) {
        alert(res.message); // 성공 메시지 표시
      } else {
        // 에러 타입에 따른 처리
        switch (res.type) {
          case 'AUTH_ERROR':
            // 로그인 페이지로 리다이렉트하거나 로그인 모달 표시
            break;
          case 'DUPLICATE_ERROR':
            // 중복 알림 표시
            break;
          case 'RUNTIME_ERROR':
          case 'NETWORK_ERROR':
            // 일반 에러 메시지 표시
            break;
        }
        alert(res.message);
      }
    }catch(error){
      alert('장바구니에 동일한 강좌가 있습니다.');
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleLike = async (review) => {
    const likeStatus = await reviewService.getLikeStatus(review.id);
    //console.log("like : " + JSON.stringify(likeStatus));
    //console.log("course : " + JSON.stringify(course));
    console.log( "review Info : " + JSON.stringify(review) );
  };

  const handleReviewSubmit = async (user, course, reviewContent, reviewRating) => {
    if (!reviewContent || reviewContent.length > 200 ) {
      alert("수강평은 1자 이상 50자 이하로 작성해야 합니다.")
      return;
    }
    if(!reviewRating){
      alert("평점을 선택해주세요.");
      return;
    }

    try {
      const res = await reviewService.createReview(user, course,reviewContent,reviewRating);
      if (res.success) {
        alert(res.message);
      }
      setReviewContent("");
      setReviewRating(1)
      document.getElementById("reviewCount").innerText = `0/50`;
      fetchCourseData();
    } catch (error) {
      alert("수강평 등록에 실패했습니다.");
    }
  };

  const countText = useCallback((text) => {
    if (!text) return 0;
    const textWithoutSpace = text.replace(/\s/g, '').replace(/[\n\r]/g, ''); // 공백 및 줄바꿈 제거
    return textWithoutSpace.length;
  }, []);

  const handleReviewContentChange = (e, isEdit = false) => {
    const currentReviewContent = e.target.value;
    const count = countText(currentReviewContent);
    if(count <= 50){
      if (isEdit) {
        setEditReviewContent(currentReviewContent);
      } else {
        setReviewContent(currentReviewContent);
      }
      document.getElementById(isEdit ? "editReviewCount" : "reviewCount").innerText = `${count}/50`;
    } else {
      toast.warn("수강평은 최대 50자까지 작성 가능합니다."); // 경고 메시지 표시
    }
  }
  const handleRatingChange = (e) => {
    const newRating = Number(e.target.value);
    setReviewRating(newRating);
    setRatingWidth(`${(newRating * 1.25) + 4}rem`);
  };

  const handleEditRatingChange = (e) => {
    const newRating = Number(e.target.value);
    setEditReviewRating(newRating);
    setEditRatingWidth(`${(newRating * 1.25) + 4}rem`);
  };

  useEffect(() => {
    handleRatingChange({ target: { value: reviewRating } });
  }, [selectRef]);

  useEffect(() => {
    handleEditRatingChange({ target: { value: editReviewRating } });
  }, [editReviewId,selectRef]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleEditReview = async (review) => {
    try {
      const res = await reviewService.updateReview(review.id, {
        content: editReviewContent,
        rating: editReviewRating
      });
      if (res.success) {
        alert(res.message);
        await fetchCourseData();
        setEditReviewId(null)
        setEditReviewContent("");
        setEditReviewRating(1);
      } else {
        alert(res.message);
      }
    }catch(error){
      alert("수강평 수정에 실패했습니다.");
    }
  }

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await reviewService.deleteReview(reviewId, user);
      if (res.success) {
        alert(res.message);
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
        await fetchCourseData();

      } else {
        alert(res.message);
      }
    } catch (error) {
      alert("수강평 삭제에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditReviewId(null);
    setEditReviewContent("");
    setEditReviewRating(1);
    setEditRatingWidth('6rem');
  };

  const handleEditClick = (review) => {
    setEditReviewId(review.id);
    setEditReviewContent(review.content);
    setEditReviewRating(review.rating);
    setEditRatingWidth(`${(review.rating * 1.25) + 4}rem`)
  };



  return (
      !course ? (<LoadingSpinner/>) :
          <PageContainer>
            <MainContent>
              <CourseInfoSection>
                <CourseHeader>
                  <CategoryBadge>{course.category}</CategoryBadge>
                  <LevelBadge>{course.level}</LevelBadge>
                  <CourseTitle>{course.title}</CourseTitle>
                  <Description dangerouslySetInnerHTML={{__html: course.description}}/>
                </CourseHeader>
                <CourseDetailTabs activeTab={activeTab} onTabChange={setActiveTab}/>
                {activeTab === 'curriculum' && (
                    <>
                      <ObjectivesSection>
                        <SectionTitle>학습 목표</SectionTitle>
                        <ObjectivesList>
                          {course?.objectives.length !== 0 ?
                              (course.objectives).map((objective, index) => (
                                  <ObjectiveItem key={index}>{objective}</ObjectiveItem>
                              )) : (
                                  <div>학습 목표가 없습니다</div>
                              )}
                        </ObjectivesList>
                      </ObjectivesSection>

                      <RequirementsSection>
                        <SectionTitle>수강 전 필요한 것들</SectionTitle>
                        <RequirementsList>
                          {course?.requirements.length !== 0 ?
                              (course.requirements).map((req, index) => (
                                  <RequirementItem key={index}>{req}</RequirementItem>
                              )) : (
                                  <div>요구 사항이 없습니다</div>
                              )}
                        </RequirementsList>
                      </RequirementsSection>

                      <SkillsSection>
                        <SectionTitle>배울 수 있는 기술</SectionTitle>
                        <SkillsList>
                          {course?.skills.length !== 0 ?
                              (course.skills).map((skill, index) => (
                                  <SkillTag key={index}>{skill}</SkillTag>
                              )) : (
                                  <div>기술 사항이 없습니다</div>
                              )}
                        </SkillsList>
                      </SkillsSection>

                      <CurriculumSection>
                        <SectionTitle>커리큘럼</SectionTitle>
                        <LectureList>
                          {course.lectures.map((lecture) => (
                              <LectureItem key={lecture.id}>
                                <LectureItemHr/>
                                <LectureOrderIndex>{lecture.orderIndex}강</LectureOrderIndex>
                                <LectureTitle>강의명 :{lecture.title}</LectureTitle>
                                <LectureDuration>영상 시간: {lecture.duration}</LectureDuration>
                              </LectureItem>
                          ))}
                        </LectureList>
                      </CurriculumSection>
                    </>
                )}
                {activeTab === 'reviews' && (
                    <ReviewsSection>
                      <SectionTitle>수강평</SectionTitle>
                      {user ?
                          (<>
                            <ReviewInputArea>
                              <div className="flex justify-between items-center">
                                <ReviewInputLabel>수강평 작성</ReviewInputLabel>
                                <RatingSelectWrapper>
                                  <RatingSelect
                                      ref={selectRef}
                                      style={{
                                        width: ratingWidth,
                                        minWidth: '6rem'
                                      }}
                                      value={reviewRating}
                                      onChange={handleRatingChange}
                                  >
                                    <option value={1}>★</option>
                                    <option value={2}>★★</option>
                                    <option value={3}>★★★</option>
                                    <option value={4}>★★★★</option>
                                    <option value={5}>★★★★★</option>
                                  </RatingSelect>
                                </RatingSelectWrapper>
                              </div>
                              <ReviewTextarea
                                  value={reviewContent}
                                  onChange={(e) => handleReviewContentChange(e)}
                                  placeholder="수강평을 작성해주세요"
                              />
                              <div className="flex justify-end mt-1">
                                <div className="text-gray-500 text-sm" id="reviewCount">0/50</div>
                              </div>
                              <SubmitButton
                                  onClick={() => handleReviewSubmit(user, course, reviewContent, reviewRating)}>등록</SubmitButton>
                            </ReviewInputArea>
                            <ObjectivesList>
                              {reviews.length === 0 ? (
                                  <div>{message}</div>
                              ) : (
                                  reviews.map(review => (
                                      <ObjectiveItem key={review.id}>
                                        {editReviewId === review.id ? (
                                            <ReviewEditArea>
                                              <div className="flex justify-between items-center">
                                                <ReviewInputLabel>수강평 수정</ReviewInputLabel>
                                                <RatingSelectWrapper>
                                                  <RatingSelect
                                                      ref={selectRef}
                                                      style={{
                                                        width: editRatingWidth,
                                                        minWidth: '6rem'
                                                      }}
                                                      value={editReviewRating}
                                                      onChange={handleEditRatingChange}
                                                  >
                                                    <option value={1}>★</option>
                                                    <option value={2}>★★</option>
                                                    <option value={3}>★★★</option>
                                                    <option value={4}>★★★★</option>
                                                    <option value={5}>★★★★★</option>
                                                  </RatingSelect>
                                                </RatingSelectWrapper>
                                              </div>
                                              <ReviewTextarea
                                                  value={editReviewContent}
                                                  onChange={(e) => handleReviewContentChange(e, true)}
                                                  placeholder="수강평을 작성해주세요"
                                              />
                                              <div className="flex justify-end mt-1">
                                                <div className="text-gray-500 text-sm" id="editReviewCount">0/50</div>
                                              </div>
                                              <EditDeleteButtonContainer style={{justifyContent: 'flex-end'}}>
                                                <EditButton onClick={() => handleEditReview(review)}>저장</EditButton>
                                                <DeleteButton onClick={() => handleCancelEdit()}>취소</DeleteButton>
                                              </EditDeleteButtonContainer>
                                            </ReviewEditArea>
                                        ) : (
                                            <>
                                              <div className="flex justify-between">
                                                <ReviewWriter>{review.writer}</ReviewWriter>
                                                <ReviewDate>
                                                  {formatDate(review.createdAt)}
                                                </ReviewDate>
                                              </div>
                                              <ReviewContent>{review.content}</ReviewContent>
                                              <div className="flex justify-between">
                                                <ReviewRating>
                                                  {'★'.repeat(review.rating)}{''}
                                                  {'☆'.repeat(5 - review.rating)} {/* 5점 만점으로 별 표시 */}
                                                </ReviewRating>
                                                <LikeButton onClick={() => handleLike(review)}>
                                                  <FontAwesomeIcon icon={faHeart}
                                                                   style={{color: '#ff6b6b', marginRight: '0.3rem'}}/>
                                                  <span>{review.likesCount}</span>
                                                </LikeButton>
                                              </div>
                                              <div className="flex justify-end">
                                                {userInfo.user && userInfo.user.name === review.writer && (
                                                    <EditDeleteButtonContainer>
                                                      <EditButton onClick={() => handleEditClick(review)}>수정</EditButton>
                                                      <DeleteButton onClick={() => handleDeleteReview(review.id)}>삭제</DeleteButton>
                                                    </EditDeleteButtonContainer>
                                                )}
                                              </div>
                                            </>
                                        )}
                                      </ObjectiveItem>
                                  ))
                              )}
                            </ObjectivesList>

                          </>) : null}

                      <OnLoadMorePagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handleLoadMore}
                      />
                    </ReviewsSection>
                )}
                {activeTab === 'instructor' && (
                    <InstructorSection instructor={course.user}/>
                )}
              </CourseInfoSection>
              <PurchaseSection>
                <PurchaseCard>
                  <PreviewImage src={courseImage} alt={course.title}/>
                  <PriceInfo>
                    <CurrentPrice>₩{course.price.toLocaleString()}</CurrentPrice>
                    <ButtonGroup>
                      <AddToCartButton onClick={() => handleAddToCart(user, course)}>
                        장바구니에 담기
                      </AddToCartButton>
                      {course.price !== 0 && (
                          <EnrollButton onClick={() => navigate(`/checkout/${course.id}`)}>
                            바로 구매하기
                          </EnrollButton>
                      )}
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
  overflow: visible; /* 추가: sticky 동작 보장 */
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  position: relative; /* 추가: 부모 컨테이너의 위치를 명시 */

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
`;

const CategoryBadge = styled.span`
  background-color: #61A9FBFF;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
`;

const LevelBadge = styled(CategoryBadge)`
  background: #61A9FBFF;
`;

const CourseTitle = styled.h1`
  font-size: 80px;
  font-weight: bold;
  margin: 1rem 0;

  @media (max-width: 1200px) {
    font-size: 60px;
  }

  @media (max-width: 768px) {
    font-size: 40px;
  }

  @media (max-width: 576px) {
    font-size: 30px;
  }
`;

const Description = styled.p`
  font-size: 20px;
  color: black;
  line-height: 1.6;

  @media (max-width: 1200px) {
    font-size: 20px;
  }

  @media (max-width: 768px) {
    font-size: 10px;
  }

  @media (max-width: 576px) {
    font-size: 10px;
  }
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
  background: var(--background);
  border-radius: var(--radius-md);
  cursor: pointer;
  &:hover {
    background: var(--border);
  }
`;

const LectureItemHr = styled.hr`
  margin-bottom: 7px;
`;

const LectureTitle = styled.h3`
  font-size: var(--font-size-base);
`;

const LectureDuration = styled.span`
  color: var(--text-light);
`;

const LectureOrderIndex = styled.span`
  margin-top: 10px;
  color: var(--text-light);
`;

const PurchaseSection = styled.div`
  position: sticky;
  top: 10rem;
  align-self: start;
`;

const PurchaseCard = styled.div`
  background: white;
  border-radius: 10px;
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
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #1971C2;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  height: 60px;

  &:hover {
    background-color: #1864AB;
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

const ReviewInputArea = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
`;

const ReviewInputLabel = styled.label`
  font-weight: bold;
  margin-bottom: 10px;
  display: block;
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 100px;
  resize: none;
  margin-bottom: 5px;
`;

const RatingSelectWrapper = styled.div`
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RatingSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #ffc107;
  background: white;
  appearance: none; /* 기본 화살표 제거 */
  -webkit-appearance: none; /* Safari, Chrome에서 화살표 제거 */
  -moz-appearance: none;  /* Firefox에서 화살표 제거 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none' viewBox='0 0 10 6'%3E%3Cpath fill='%236B7280' d='M5 6L0 0h10L5 6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 10px) center;
  padding-right: 20px; /* 화살표 공간 확보 */
  min-width: 6rem;
  width: ${props => props.width};
`;


const SubmitButton = styled.button`
  background-color: #1971C2; /* 녹색 */
  color: white; /* 글자색 */
  border: none; /* 테두리 없음 */
  border-radius: 4px; /* 모서리 둥글게 */
  padding: 10px 15px; /* 패딩 */
  cursor: pointer; /* 커서 모양 변경 */
  font-size: 16px; /* 글자 크기 */
  transition: background-color 0.3s; /* 배경색 변화 애니메이션 */
  align-self: flex-end;

  &:hover {
    background-color: #1864AB; /* 호버 시 배경색 변화 */
  }
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
  color: #ffc107; // Gold color for rating stars
`;

const LikeButton = styled.div`
  background-color: transparent; /* 좋아요 버튼 배경색 */
  color: white; /* 글자색 */
  border: none; /* 테두리 없음 */
  border-radius: 5px; /* 모서리 둥글게 */
  padding: 10px 15px; /* 패딩 */
  cursor: pointer; /* 커서 모양 변경 */
  font-size: 16px; /* 글자 크기 */
  transition: background-color 0.3s; /* 배경색 변화 애니메이션 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background-color: transparent; /* 호버 시 배경색 변화 */
  }

  &:active {
    background-color: transparent; /* 클릭 시 배경색 변화 */
  }
`;

const ReviewDate = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

const EditDeleteButtonContainer = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 5px;
  justify-content: flex-end;
`;

const EditButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const DeleteButton = styled.button`
  background-color: #e0e0e0;
  color: #333;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const ReviewEditArea = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
`;

export default CourseDetailPage;