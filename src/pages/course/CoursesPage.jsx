import { useState, useEffect } from 'react';
import { CourseService } from '../../infrastructure/services/CourseService';
import CourseCard from '../../shared/components/CourseCard';
import { getCategoryOptions, getLevelOptions, getSortOptions } from '../../infrastructure/constants/courseConstants';
import { toast } from 'react-toastify';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    sort: 'newest',
    search: '',
    page: 0,
    size: 10
  });

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await CourseService.getCourses(filters);
      setCourses(response.courses || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(response.currentPage || 0);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('강좌 목록을 불러오는데 실패했습니다.');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value === 'all' ? '' : value,
      page: 0
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 강좌</h1>

      {/* 검색 바 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="강좌 검색..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* 필터 섹션 */}
      <div className="flex gap-4 mb-8">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {getCategoryOptions().map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={filters.level}
          onChange={(e) => handleFilterChange('level', e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {getLevelOptions().map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {getSortOptions().map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* 강좌 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {!isLoading && courses.length === 0 ? (
          <div className="col-span-4 text-center py-8 text-gray-500">
            검색 결과가 없습니다.
          </div>
        ) : (
          courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`mx-1 px-4 py-2 rounded ${currentPage === i
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CoursesPage;