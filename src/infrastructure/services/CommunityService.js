import { axiosInstance } from '../api/axios.config';
import { API_ENDPOINTS } from '../api/endpoints';

class CommunityService {
  async getPosts(page = 1, filters = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.COMMUNITY);
      const posts = response.data?.posts || [];
      
      const filteredPosts = this.filterPosts(posts, filters);
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      
      return {
        data: filteredPosts.slice(startIndex, endIndex),
        total: filteredPosts.length,
        categories: response.data?.categories || []
      };
    } catch (error) {
      console.error('게시글 목록 조회 실패:', error);
      return { data: [], total: 0, categories: [] };
    }
  }

  filterPosts(posts, filters) {
    return posts.filter(post => {
      if (filters.category && filters.category !== '전체') {
        return post.category === filters.category;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return post.title.toLowerCase().includes(searchLower) || 
               post.content.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  async createPost(postData) {
    try {
      const response = await api.get(API_ENDPOINTS.COMMUNITY);
      const posts = response.data?.posts || [];
      
      const newPost = {
        id: posts.length + 1,
        ...postData,
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0,
        comments: []
      };
      
      return { success: true, data: newPost };
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      throw error;
    }
  }

  async addComment(postId, commentData) {
    try {
      const response = await api.get(API_ENDPOINTS.COMMUNITY);
      const posts = response.data?.posts || [];
      const post = posts.find(p => p.id === postId);
      
      if (!post) throw new Error('게시글을 찾을 수 없습니다.');
      
      const newComment = {
        id: (post.comments?.length || 0) + 1,
        ...commentData,
        createdAt: new Date().toISOString(),
        likes: 0
      };
      
      return { success: true, data: newComment };
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      throw error;
    }
  }
}

export const communityService = new CommunityService();