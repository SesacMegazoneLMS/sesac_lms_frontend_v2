import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineHeart, AiOutlineEye, AiFillHeart } from 'react-icons/ai';
import { BiComment, BiSearch, BiPencil } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { BsMegaphone, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { HiOutlineTag } from 'react-icons/hi';
import { Pagination } from '../../shared/components/common/Pagination';
import { WriteModal } from './components/WriteModal';
import { CommentSection } from './components/CommentSection';
import { useCommunity } from '../../shared/hooks/UseCommunity';
import { LoadingSpinner } from '../../shared/components/common/LoadingSpinner';
import { FaDatabase, FaPalette, FaCode, FaShieldAlt } from 'react-icons/fa';

const categoryIcons = {
    'data': '/icons/data.png',
    'design': '/icons/design.png',
    'programming': '/icons/programming.png',
    'security': '/icons/security.png'
  };

const CategoryIcon = ({ category }) => {
    const iconPath = categoryIcons[category.toLowerCase()];
    if (iconPath) {
        return <img src={iconPath} alt={category} style={{width: '20px', height: '20px'}} />;
    }
    switch(category.toLowerCase()) {
        case 'data':
            return <FaDatabase />;
        case 'design':
            return <FaPalette />;
        case 'security':
            return <FaShieldAlt />;
        default:
            return <FaCode />;
    }
}

const CommunityPage = () => {
  const {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    fetchPosts,
    createPost,
    handleLike,
    setCurrentPage
  } = useCommunity();

  const [showWriteModal, setShowWriteModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBookmarked, setIsBookmarked] = useState({});
  const [isLiked, setIsLiked] = useState({});
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchPosts(currentPage, { 
      category: activeTab === '전체' ? '' : activeTab,
      search: searchTerm,
      sort: sortBy
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeTab, searchTerm, sortBy]);

  const icons = {
    close: <IoCloseOutline size={20} />,
    like: <AiOutlineHeart size={16} />,
    likeActive: <AiFillHeart size={16} color="#ff0000" />,
    comment: <BiComment size={16} />,
    view: <AiOutlineEye size={16} />,
    write: <BiPencil size={16} />,
    search: <BiSearch size={20} />,
    notice: <BsMegaphone size={16} />,
    user: <FiUser size={16} />,
    tag: <HiOutlineTag size={16} />,
    bookmark: <BsBookmark size={16} />,
    bookmarkActive: <BsBookmarkFill size={16} color="#1971C2" />
  };

  const tabs = ['전체', '공지사항', '질문', '자유주제', '스터디', '취업/이직'];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  const getSortedPosts = () => {
    return [...posts].sort((a, b) => {
      switch(sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'mostLiked':
          return b.likes - a.likes;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  };

  const handleBookmark = (postId) => {
    setIsBookmarked(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <PageWrapper>
      <Container>
        {showBanner && (
          <Banner>
            <BannerContent style={{ backgroundColor: '#E7F5FF', color: '#1971C2', border: '1px solid #A5D8FF', borderRadius: '4px', padding: '12px 16px' }}>
              <IconWrapper style={{ color: '#1971C2' }}>{icons.notice}</IconWrapper>
              커뮤니티 이용 규칙을 확인해주세요!
              <CloseButton onClick={() => setShowBanner(false)} style={{ color: '#1971C2' }}>
                {icons.close}
              </CloseButton>
            </BannerContent>
          </Banner>
        )}

        <Header>
          <SearchSection>
            <SearchWrapper>
              <SearchInput
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton>{icons.search}</SearchButton>
            </SearchWrapper>
            <FilterWrapper>
              <SortSelect onChange={(e) => setSortBy(e.target.value)}>
                <option value="latest">최신순</option>
                <option value="popular">조회순</option>
                <option value="mostLiked">좋아요순</option>
              </SortSelect>
            </FilterWrapper>
          </SearchSection>
          <WriteButton>
            {icons.write} 글쓰기
          </WriteButton>
        </Header>

        <TabContainer>
          {tabs.map(tab => (
            <TabButton
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabButton>
          ))}
        </TabContainer>

        <PostList>
          {loading ? (
            <LoadingSpinner />
          ) : (
            posts.map(post => (
              <PostCard key={post.id}>
                <PostHeader>
                  <CategoryTag>
                    <CategoryIcon category={post.category} />
                    {post.category}
                  </CategoryTag>
                  <PostTitle>{post.title}</PostTitle>
                </PostHeader>
                <PostContent>{post.content}</PostContent>
                <PostFooter>
                  <AuthorSection>
                    <AuthorAvatar>{icons.user}</AuthorAvatar>
                    <AuthorName>{post.author}</AuthorName>
                    <PostDate>{formatDate(post.date)}</PostDate>
                  </AuthorSection>
                  <InteractionSection>
                    <InteractionButton onClick={() => handleLike(post.id)}>
                      {isLiked[post.id] ? icons.likeActive : icons.like}
                      <span>{post.likes}</span>
                    </InteractionButton>
                    <InteractionButton>
                      {icons.comment}
                      <span>{post.comments?.length || 0}</span>
                    </InteractionButton>
                    <BookmarkButton onClick={() => handleBookmark(post.id)}>
                      {isBookmarked[post.id] ? icons.bookmarkActive : icons.bookmark}
                    </BookmarkButton>
                  </InteractionSection>
                </PostFooter>
                <CommentSection 
                  postId={post.id}
                  comments={post.comments?.length ? post.comments : []}
                />
              </PostCard>
            ))
          )}
        </PostList>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Container>

      <WriteModal
        show={showWriteModal}
        onClose={() => setShowWriteModal(false)}
        onSubmit={createPost}
      />
    </PageWrapper>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Banner = styled.div`
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #495057;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 16px;
  color: #212529;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #1971C2;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #adb5bd;
`;

const MainContent = styled.main``;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: ${props => props.active ? '#1971C2' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#495057'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#1971C2' : '#e9ecef'};
  }
`;

const WriteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const WriteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #1971C2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #1864AB;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CategoryTag = styled.span`
  background-color: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PostTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 8px;
  color: #212529;
`;

const PostContent = styled.p`
  color: #495057;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const AuthorSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #868e96;
  font-size: 14px;
`;

const Stats = styled.div`
  display: flex;
  gap: 16px;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #868e96;
  font-size: 14px;
`;

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const PageWrapper = styled.div`
  background-color: var(--wwwinflearncom-athens-gray);
  min-height: 100vh;
  padding: 40px 0;
`;

const SearchSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
`;

const SearchButton = styled.button`
  background-color: var(--wwwinflearncom-semantic-button-background);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--wwwinflearncom-semantic-button-hover);
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const SortSelect = styled.select`
  background-color: var(--wwwinflearncom-semantic-button-background);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--wwwinflearncom-semantic-button-hover);
  }
`;

const AuthorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #868e96;
`;

const AuthorName = styled.span`
  color: #495057;
  font-size: 14px;
`;

const PostDate = styled.span`
  color: #868e96;
  font-size: 14px;
`;

const InteractionSection = styled.div`
  display: flex;
  gap: 16px;
`;

const InteractionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background-color: ${props => props.isLiked ? '#ff0000' : '#f8f9fa'};
  color: ${props => props.isLiked ? 'white' : '#495057'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isLiked ? '#cc0000' : '#e9ecef'};
  }
`;

const BookmarkButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background-color: ${props => props.isBookmarked ? '#1971C2' : '#f8f9fa'};
  color: ${props => props.isBookmarked ? 'white' : '#495057'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.isBookmarked ? '#1864AB' : '#e9ecef'};
  }
`;

export default CommunityPage;