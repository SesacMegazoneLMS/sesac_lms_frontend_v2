import axios from 'axios';
import communityData from '../mock/db/community.json';

const API_URL = process.env.REACT_APP_API_URL || '';

class CommunityService {
  async getPosts(page = 1, filters = {}) {
    // 개발 환경에서는 mock 데이터 사용
    if (process.env.NODE_ENV === 'development') {
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      const filteredPosts = this.filterPosts(communityData.posts, filters);
      
      return {
        data: filteredPosts.slice(startIndex, endIndex),
        total: filteredPosts.length
      };
    }

    // 프로덕션 환경에서는 실제 API 호출
    const response = await axios.get(`${API_URL}/api/community/posts`, {
      params: { page, ...filters }
    });
    return response.data;
  }

  filterPosts(posts, filters) {
    return posts.filter(post => {
      if (filters.category && filters.category !== '전체') {
        return post.category === filters.category;
      }
      if (filters.search) {
        return post.title.includes(filters.search) || 
               post.content.includes(filters.search);
      }
      return true;
    });
  }

  async createPost(postData) {
    if (process.env.NODE_ENV === 'development') {
      // Mock implementation
      return {
        success: true,
        data: {
          id: Date.now(),
          ...postData,
          createdAt: new Date().toISOString(),
          likes: 0,
          views: 0,
          comments: []
        }
      };
    }

    const response = await axios.post(`${API_URL}/api/community/posts`, postData);
    return response.data;
  }

  async likePost(postId) {
    if (process.env.NODE_ENV === 'development') {
      return { success: true };
    }

    const response = await axios.post(`${API_URL}/api/community/posts/${postId}/like`);
    return response.data;
  }

  async addComment(postId, commentData) {
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        data: {
          id: Date.now(),
          ...commentData,
          createdAt: new Date().toISOString(),
          likes: 0
        }
      };
    }

    const response = await axios.post(
      `${API_URL}/api/community/posts/${postId}/comments`,
      commentData
    );
    return response.data;
  }
}

export const communityService = new CommunityService();