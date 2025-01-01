import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { BsMegaphone } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { FiUser, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [comments, setComments] = useState([]);
  const viewerRef = useRef(null);
  const navigate = useNavigate("");
  const { id } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.auth.user);

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
    if (id) {
      fetchPostDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked || false);
      setLikeCount(post.likes || 0);
    }

    if (post && viewerRef.current) {
      const viewer = new window.toastui.Editor.factory({
        el: viewerRef.current,
        initialValue: post.content,
        viewer: true,
        plugins: [
          [
            window.toastui.Editor.plugin.uml,
            { rendererURL: "http://www.plantuml.com/plantuml/png/" },
          ],
          [
            window.toastui.Editor.plugin.chart,
            {
              width: 800, // max-w-4xl에 맞춤
              height: 400, // 2:1 비율 유지
              minWidth: 500, // 모바일 고려
              minHeight: 300, // 모바일 고려
              maxWidth: 800, // max-w-4xl과 동일
              maxHeight: 400, // 2:1 비율 유지
            },
          ],
          [window.toastui.Editor.plugin.codeSyntaxHighlight],
        ],
      });
    }
  }, [post]);

  const fetchPostDetail = async (postId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${postId}`
      );
      if (response.data.success) {
        setPost(response.data.data);
        setComments(response.data.data.comments || []);
      }
    } catch (error) {
      console.error("게시물 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePostHandler = async () => {
    const isConfirmed = window.confirm("게시글을 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}`
      );

      if (response.data.success) {
        alert("게시물이 삭제되었습니다.");
        navigate("/community/all");
      }
    } catch (error) {
      console.error("게시물 삭제 실패", error);
    }
  };

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comment`,
        {
          content: commentContent,
          author: { id: user.email, name: user.name },
        }
      );

      if (response.data.success) {
        // 새 댓글을 목록에 추가
        setComments([...comments, response.data.data]);
        // 입력창 초기화
        setCommentContent("");
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정 핸들러
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  // 댓글 수정 제출
  const handleEditSubmit = async (commentId) => {
    if (!editingContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.put(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comments/${commentId}`,
        {
          content: editingContent,
          author: { id: user.email, name: user.name },
        }
      );

      if (response.data.success) {
        // 댓글 목록 업데이트
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? { ...comment, content: editingContent }
              : comment
          )
        );
        setEditingCommentId(null);
        setEditingContent("");
      }
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId) => {
    const isConfirmed = window.confirm("댓글을 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comments/${commentId}`
      );

      if (response.data.success) {
        // 댓글 목록에서 삭제된 댓글 제거
        setComments(comments.filter((comment) => comment.id !== commentId));
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 답글 작성 핸들러
  const handleReplySubmit = async (parentId) => {
    if (!replyContent.trim()) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comments/${parentId}/replies`,
        {
          content: replyContent,
          author: { id: user.email, name: user.name },
        }
      );

      if (response.data.success) {
        // 답글을 부모 댓글의 replies 배열에 추가
        setComments(
          comments.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), response.data.data],
                }
              : comment
          )
        );
        setReplyContent("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("답글 작성 실패:", error);
      alert("답글 작성에 실패했습니다.");
    }
  };

  // 답글 수정 시작 핸들러
  const handleReplyEditStart = (reply) => {
    setEditingReplyId(reply.id);
    setEditingReplyContent(reply.content);
  };

  // 답글 수정 취소 핸들러
  const handleReplyEditCancel = () => {
    setEditingReplyId(null);
    setEditingReplyContent("");
  };

  // 답글 수정 제출 핸들러
  const handleReplyEditSubmit = async (commentId, replyId) => {
    if (!editingReplyContent.trim()) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.put(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comments/${commentId}/replies/${replyId}`,
        {
          content: editingReplyContent,
        }
      );

      if (response.data.success) {
        // 답글 목록 업데이트
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? { ...reply, content: editingReplyContent }
                    : reply
                ),
              };
            }
            return comment;
          })
        );
        setEditingReplyId(null);
        setEditingReplyContent("");
      }
    } catch (error) {
      console.error("답글 수정 실패:", error);
      alert("답글 수정에 실패했습니다.");
    }
  };

  // 답글 삭제 핸들러
  const handleReplyDelete = async (commentId, replyId) => {
    const isConfirmed = window.confirm("답글을 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comments/${commentId}/replies/${replyId}`
      );

      if (response.data.success) {
        // 답글 목록에서 삭제된 답글 제거
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply.id !== replyId
                ),
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("답글 삭제 실패:", error);
      alert("답글 삭제에 실패했습니다.");
    }
  };

  // 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/like`,
        {
          like: !isLiked,
        }
      );

      if (response.data.success) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 댓글 좋아요 핸들러
  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.post(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comments/${commentId}/like`
      );

      if (response.data.success) {
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  isLiked: !comment.isLiked,
                  likes: comment.isLiked
                    ? comment.likes - 1
                    : comment.likes + 1,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("댓글 좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 답글 좋아요 핸들러
  const handleReplyLike = async (commentId, replyId) => {
    try {
      const response = await axios.post(
        `https://crxqx9589i.execute-api.ap-northeast-2.amazonaws.com/dev/api/posts/${id}/comments/${commentId}/replies/${replyId}/like`
      );

      if (response.data.success) {
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? {
                        ...reply,
                        isLiked: !reply.isLiked,
                        likes: reply.isLiked
                          ? reply.likes - 1
                          : reply.likes + 1,
                      }
                    : reply
                ),
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("답글 좋아요 처리 실패:", error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  // 로딩 중일 때 스피너 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 데이터가 없을 때의 처리도 추가
  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa]">
        게시물을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10">
      <div className="max-w-4xl mx-auto px-5">
        {/* 배너 */}
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

        {/* 게시글 헤더 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col gap-4">
            {/* 카테고리와 버튼들 */}
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
                {categoryMap[post.category]}
              </span>
              {user && post.author?.id === user.email && (
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1 text-sm font-medium border border-gray-200"
                    onClick={() => navigate(`/community/post-edit/${id}`)}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    수정
                  </button>
                  <button
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1 text-sm font-medium border border-red-200"
                    onClick={() => deletePostHandler()}
                  >
                    <FiTrash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>

            {/* 작성자 정보 */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiUser className="text-gray-500 text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {post.author?.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    isLiked
                      ? "bg-red-50 text-red-600"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                  <span>{likeCount}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors">
                  <BsBookmark />
                </button>
              </div>
            </div>

            {/* 태그 */}
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
          </div>
        </div>

        {/* 게시글 본문 */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div ref={viewerRef} className="prose max-w-none"></div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            댓글 {comments.length}개
          </h3>
          {/* 댓글 작성 폼 */}
          <div className="mb-6">
            <textarea
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="댓글을 입력하세요"
              rows="3"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500 text-sm">
                {commentContent.length}/500자
              </span>
              <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors
                ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "작성 중..." : "댓글 작성"}
              </button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                {/* 댓글 헤더 */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        {comment.author.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user &&
                      comment.author.id === user.email &&
                      (editingCommentId === comment.id ? (
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
                            onClick={() => handleEditSubmit(comment.id)}
                          >
                            완료
                          </button>
                          <button
                            className="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
                            onClick={handleEditCancel}
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            className="px-2.5 py-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
                            onClick={() => handleEditStart(comment)}
                          >
                            수정
                          </button>
                          <button
                            className="px-2.5 py-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            삭제
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 댓글 내용 */}
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <span className="text-gray-500 text-sm mr-4">
                        {editingContent.length}/500자
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700">{comment.content}</p>

                    {/* 답글 버튼 */}
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        className="text-sm text-gray-500 hover:text-blue-600"
                        onClick={() => setReplyingTo(comment.id)}
                      >
                        답글 달기
                      </button>
                      <button
                        onClick={() => handleCommentLike(comment.id)}
                        className={`flex items-center gap-1 text-sm ${
                          comment.isLiked
                            ? "text-red-600"
                            : "text-gray-500 hover:text-red-600"
                        }`}
                      >
                        {comment.isLiked ? <AiFillHeart /> : <AiOutlineHeart />}
                        <span>{comment.likes || 0}</span>
                      </button>
                    </div>

                    {/* 답글 작성 폼 */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 pl-8 border-l-2 border-gray-100">
                        <textarea
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                          placeholder="답글을 입력하세요"
                          rows="2"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-gray-500 text-sm">
                            {replyContent.length}/500자
                          </span>
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                            >
                              취소
                            </button>
                            <button
                              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={() => handleReplySubmit(comment.id)}
                            >
                              답글 작성
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {/* 답글 목록 */}
                {comment.replies?.length > 0 && (
                  <div className="mt-3 pl-8 space-y-3">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="border-l-2 border-gray-100 pl-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <FiUser className="text-gray-500 text-sm" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 text-sm">
                                {reply.author.name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {user &&
                              reply.author.id === user.email &&
                              (editingReplyId === reply.id ? (
                                <div className="flex gap-2">
                                  <button
                                    className="px-2.5 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                                    onClick={() =>
                                      handleReplyEditSubmit(
                                        comment.id,
                                        reply.id
                                      )
                                    }
                                  >
                                    완료
                                  </button>
                                  <button
                                    className="px-2.5 py-1 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                                    onClick={handleReplyEditCancel}
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <button
                                    className="px-2 py-0.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded text-xs transition-colors"
                                    onClick={() => handleReplyEditStart(reply)}
                                  >
                                    수정
                                  </button>
                                  <button
                                    className="px-2 py-0.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded text-xs transition-colors"
                                    onClick={() =>
                                      handleReplyDelete(comment.id, reply.id)
                                    }
                                  >
                                    삭제
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                        {editingReplyId === reply.id ? (
                          <div className="mt-2">
                            <textarea
                              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                              value={editingReplyContent}
                              onChange={(e) =>
                                setEditingReplyContent(e.target.value)
                              }
                              rows="2"
                            />
                            <div className="flex justify-end mt-1">
                              <span className="text-gray-500 text-xs">
                                {editingReplyContent.length}/500자
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-700 mt-1">
                              {reply.content}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() =>
                                  handleReplyLike(comment.id, reply.id)
                                }
                                className={`flex items-center gap-1 text-sm ${
                                  reply.isLiked
                                    ? "text-red-600"
                                    : "text-gray-500 hover:text-red-600"
                                }`}
                              >
                                {reply.isLiked ? (
                                  <AiFillHeart />
                                ) : (
                                  <AiOutlineHeart />
                                )}
                                <span>{reply.likes || 0}</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
