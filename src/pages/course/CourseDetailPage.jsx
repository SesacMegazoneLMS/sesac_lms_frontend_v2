import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { apiEndpoints } from '../../infrastructure/api/endpoints';
import { LoadingSpinner } from '../../shared/components/common/LoadingSpinner';
function CourseDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  const [relatedRoadmaps, setRelatedRoadmaps] = useState([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await apiEndpoints.courses.getById(parseInt(id));
        setCourse(data);
        // 관련 로드맵 찾기
        const roadmapsData = await apiEndpoints.roadmaps.getAll();
        const related = roadmapsData.filter(roadmap => 
          roadmap.courses.includes(parseInt(id))
        );
        setRelatedRoadmaps(related);
      } catch (error) {
        toast.error('강좌 정보를 불러오는데 실패했습니다.')
      }
    };
    fetchCourseData();
  }, [id]);

  const handleAddToCart = () => {
    if (!course) return;
    
    dispatch(addToCart({
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      price: course.price,
      thumbnail: course.thumbnail
    }));
    toast.success('장바구니에 추가되었습니다.');
  };

  if (!course) return <LoadingSpinner />;

  return (
    <PageContainer>
      <MainContent>
        <CourseInfoSection>
          <CourseHeader>
            <CategoryBadge>{course.category}</CategoryBadge>
            <CourseTitle>{course.title}</CourseTitle>
            <Description>{course.description}</Description>
            <Stats>
              <Rating>
                <StarIcon>★</StarIcon>
                <span>{course.rating}</span>
                <StudentCount>({course.students.toLocaleString()}명)</StudentCount>
              </Rating>
              <LastUpdate>최근 업데이트: {course.lastUpdated}</LastUpdate>
            </Stats>
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

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

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
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CategoryBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 20px;
  color: #495057;
  font-size: 0.9rem;
`;

const CourseTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #212529;
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #495057;
  line-height: 1.6;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #868e96;
  font-size: 0.9rem;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StarIcon = styled.span`
  color: #ffd43b;
`;

const StudentCount = styled.span`
  color: #868e96;
`;

const LastUpdate = styled.span`
  color: #868e96;
`;

const RelatedRoadmaps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const RoadmapCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const RoadmapThumbnail = styled.img`
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
`;

const RoadmapInfo = styled.div`
  flex: 1;
`;

const RoadmapTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const RoadmapDescription = styled.p`
  font-size: 0.9rem;
  color: #495057;
  margin-bottom: 0.5rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  padding: 0.25rem 0.75rem;
  background: #e9ecef;
  border-radius: 15px;
  font-size: 0.8rem;
  color: #495057;
`;

const PurchaseSection = styled.div`
  position: sticky;
  top: 2rem;
`;

const PurchaseCard = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const PriceInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const CurrentPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
`;

const CartButton = styled(Button)`
  background: #00c471;
  color: white;

  &:hover {
    background: #00a65f;
  }
`;

const BuyButton = styled(Button)`
  background: #228be6;
  color: white;

  &:hover {
    background: #1c7ed6;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const AddToCartButton = styled(Button)`
  background: #00c471;
  color: white;
  &:hover {
    background: #00a65f;
  }
`;

const EnrollButton = styled(Button)`
  background: #228be6;
  color: white;
  &:hover {
    background: #1c7ed6;
  }
`;

export default CourseDetailPage;