import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BiSearch, BiPencil } from "react-icons/bi";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { BsMegaphone } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";

const BoardPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const currentCategory = searchParams.get("category") || "all";
  const [showBanner, setShowBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

  const categories = [
    { id: "all", name: "전체보기" },
    { id: "announcement", name: "공지사항" },
    { id: "qna", name: "질문답변" },
    { id: "free", name: "자유주제" },
    { id: "mailing", name: "매일메일" },
  ];

  const categoryMap = {
    announcement: "공지사항",
    qna: "질문답변",
    free: "자유주제",
    mailing: "매일메일",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentCategory]);

  useEffect(() => {
    setPosts((prevPosts) => sortPosts(prevPosts));
  }, [sortBy]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const url = new URL(
        "https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts"
      );

      if (currentCategory !== "all") {
        url.searchParams.append("category", currentCategory);
      }

      if (searchTerm) {
        url.searchParams.append("search", searchTerm);
      }

      const response = await axios.get(url.toString());
      if (response.data.success) {
        // 데이터를 가져온 후 바로 정렬 적용
        setPosts(sortPosts(response.data.data));
      }
    } catch (error) {
      console.error("게시물 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSearchParams({ category: categoryId });
    setSearchTerm("");
  };

  // 검색 핸들러 추가
  const handleSearch = () => {
    fetchPosts();
  };

  const sortPosts = (postsToSort) => {
    switch (sortBy) {
      case "latest":
        return [...postsToSort].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "popular":
        return [...postsToSort].sort(
          (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
        );
      case "mostLiked":
        return [...postsToSort].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return postsToSort;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-5">
        {/* 배너 추가 */}
        {showBanner && (
          <div className="mb-6">
            <div className="flex items-center justify-between bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <BsMegaphone className="text-lg" />
                <span>커뮤니티 이용 규칙을 확인해주세요!</span>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>
          </div>
        )}

        {/* 검색 및 필터 섹션 */}
        <div className="flex items-center mb-8">
          <div className="flex gap-4 items-center flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg cursor-pointer hover:border-gray-300 focus:outline-none focus:border-blue-500 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1.25rem",
                paddingRight: "2.5rem",
              }}
            >
              <option value="latest">최신순</option>
              <option value="popular">댓글순</option>
              <option value="mostLiked">좋아요순</option>
            </select>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600"
              >
                <BiSearch size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 카테고리 탭과 글쓰기 버튼 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors
          ${
            currentCategory === category.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {user && (
            <Link
              to="/community/write"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              <BiPencil /> 글쓰기
            </Link>
          )}
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              게시물이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col gap-3">
                  {/* 카테고리와 날짜 */}
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                      {categoryMap[post.category]}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h2 className="text-xl font-medium">
                    <Link
                      to={`/community/post-detail/${post.id}`}
                      className="text-gray-900 hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* 태그 목록 */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 작성자 정보와 상호작용 버튼 */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <FiUser className="text-gray-500" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {post.author?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-500">
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200">
                        <AiOutlineHeart />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200">
                        <BiComment />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200">
                        <AiOutlineEye />
                        <span>{post.views || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200">
                        <BsBookmark />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
