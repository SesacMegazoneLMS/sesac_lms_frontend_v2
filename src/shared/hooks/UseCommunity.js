import { useState, useEffect } from 'react';
import { communityService } from '../../infrastructure/services/CommunityService';

export const useCommunity = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  const fetchPosts = async (page, filters = {}) => {
    try {
      setLoading(true);
      const response = await communityService.getPosts(page, filters);
      setPosts(response.data);
      setTotalPages(Math.ceil(response.total / postsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      setLoading(true);
      await communityService.createPost(postData);
      fetchPosts(currentPage);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLike = async (postId) => {
    try {
      await communityService.likePost(postId);
      fetchPosts(currentPage);
    } catch (err) {
      setError(err.message);
    }
  };

  const addComment = async (postId, commentData) => {
    try {
      await communityService.addComment(postId, commentData);
      fetchPosts(currentPage);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    fetchPosts,
    createPost,
    handleLike,
    addComment,
    setCurrentPage
  };
};

export default useCommunity;