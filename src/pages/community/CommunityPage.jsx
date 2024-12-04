import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineHeart, AiOutlineEye, AiFillHeart } from 'react-icons/ai';
import { BiComment, BiSearch, BiPencil } from 'react-icons/bi';
import { IoCloseOutline } from 'react-icons/io5';
import { FiUser } from 'react-icons/fi';
import { BsMegaphone, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { HiOutlineTag } from 'react-icons/hi';
import communityData from '../../infrastructure/mock/db/community.json';

const CommunityPage = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

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

  const tabs = ['전체', ...communityData.categories];

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

  return (
    <Container className="max-w-7xl mx-auto px-4">
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
        <Title>커뮤니티</Title>
        <SearchWrapper>
          <SearchInput
            placeholder="관심있는 내용을 검색해보세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon>{icons.search}</SearchIcon>
        </SearchWrapper>
      </Header>

      <MainContent>
        <TabContainer>
          {tabs.map(tab => (
            <Tab 
              key={tab}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </TabContainer>

        <WriteButtonWrapper>
          <WriteButton>
            {icons.write}
            <span>글쓰기</span>
          </WriteButton>
        </WriteButtonWrapper>

        <PostList>
          {communityData.posts.map(post => (
            <PostItem key={post.id}>
              <PostHeader>
                <CategoryTag>{post.category}</CategoryTag>
                <AuthorInfo>
                  <IconWrapper>{icons.user}</IconWrapper>
                  User {post.userId} · {formatDate(post.createdAt)}
                </AuthorInfo>
              </PostHeader>
              
              <PostTitle>{post.title}</PostTitle>
              <PostContent>{post.content}</PostContent>
              
              <PostFooter>
                <Stats>
                  <StatItem>
                    {icons.like} {post.likes}
                  </StatItem>
                  <StatItem>
                    {icons.comment} {post.comments.length}
                  </StatItem>
                  <StatItem>
                    {icons.view} {post.views}
                  </StatItem>
                </Stats>
              </PostFooter>
            </PostItem>
          ))}
        </PostList>
      </MainContent>
    </Container>
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

const Tab = styled.button`
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

const PostItem = styled.article`
  padding: 24px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #1971C2;
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

const AuthorInfo = styled.div`
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

export default CommunityPage;