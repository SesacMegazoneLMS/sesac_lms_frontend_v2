import { useState } from 'react';
import { FiThumbsUp, FiStar } from 'react-icons/fi';

function ReviewsSection({ reviews }) {
  const [sortBy, setSortBy] = useState('recent');

  const getSortedReviews = () => {
    return [...reviews].sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return b.likes - a.likes;
    });
  };

  return (
    <div>
      {/* 수강평 요약 */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold">{reviews[0].courseRating}</div>
          <div className="flex items-center text-yellow-400">
            {'★'.repeat(Math.floor(reviews[0].courseRating))}
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          총 {reviews.length}개 수강평
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="flex space-x-2 mb-6">
        {[
          { value: 'recent', label: '최신순' },
          { value: 'rating', label: '평점순' },
          { value: 'likes', label: '추천순' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSortBy(value)}
            className={`px-3 py-1 rounded ${
              sortBy === value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 수강평 목록 */}
      <div className="space-y-6">
        {getSortedReviews().map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{review.userName}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-yellow-400">
                {'★'.repeat(review.rating)}
              </div>
            </div>
            <p className="text-gray-600 mb-4">{review.content}</p>
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary">
              <FiThumbsUp />
              <span>도움됐어요 {review.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsSection;