export const COURSE_CATEGORIES = {
  PROGRAMMING: { value: 'PROGRAMMING', label: '프로그래밍' },
  FRONTEND: { value: 'FRONTEND', label: '프론트엔드' },
  BACKEND: { value: 'BACKEND', label: '백엔드' },
  AI: { value: 'AI', label: 'AI' },
};

export const COURSE_LEVELS = {
  BASIC: { value: '초급', label: '초급' },
  MEDIUM: { value: '중급', label: '중급' },
  HIGH: { value: '고급', label: '고급' }
};

export const SORT_OPTIONS = {
  NEWEST: { value: 'newest', label: '최신순' },
  PRICE_ASC: { value: 'price_asc', label: '가격 낮은순' },
  PRICE_DESC: { value: 'price_desc', label: '가격 높은순' },
  RATING: { value: 'rating', label: '평점순' }
};

// 전체 옵션을 포함한 배열 반환 함수들
export const getCategoryOptions = () => [
  { value: '', label: '전체 카테고리' },
  ...Object.values(COURSE_CATEGORIES)
];

export const getLevelOptions = () => [
  { value: '', label: '전체 레벨' },
  ...Object.values(COURSE_LEVELS)
];

export const getSortOptions = () => Object.values(SORT_OPTIONS);

