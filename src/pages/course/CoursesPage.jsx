import { useState, useEffect } from 'react';
import { CourseService } from '../../infrastructure/services/CourseService';
import CourseCard from '../../shared/components/CourseCard';
import { getCategoryOptions, getLevelOptions, getSortOptions } from '../../infrastructure/constants/courseConstants';
import { toast } from 'react-toastify';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    sort: 'newest',
    search: '',
    page: 0,
    size: 10
  });

  // const categories = [
  //   { value: 'all', label: '전체' },
  //   { value: 'programming', label: '프로그래밍' },
  //   { value: 'frontend', label: '프론트엔드' },
  //   { value: 'backend', label: '백엔드' },
  //   { value: 'security', label: '보안' },
  //   { value: 'mobile', label: '모바일' },
  //   { value: 'devops', label: 'DevOps' }
  // ];

  // const levels = [
  //   { value: 'all', label: '전체 레벨' },
  //   { value: '초급', label: '초급' },
  //   { value: '중급', label: '중급' },
  //   { value: '고급', label: '고급' }
  // ];

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     const data = await CourseService.getAllCourses();
  //     setCourses(data);
  //   };
  //   fetchCourses();
  // }, []);

  // const filteredCourses = courses.filter(course => {
  //   if (filters.category !== 'all' && course.category !== filters.category) return false;
  //   if (filters.level !== 'all' && course.level !== filters.level) return false;
  //   return true;
  // });

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await CourseService.getCourses(filters);
      setCourses(response.courses)
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      toast.error('강좌 목록을 불러오는데 실패했습니다.');
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
  }

  return (
      // <div className="max-w-7xl mx-auto px-4 py-8">
      //   <h1 className="text-3xl font-bold mb-8">전체 강좌</h1>

      //   {/* 필터 섹션 */}
      //   <div className="flex gap-4 mb-8">
      //     <select
      //       value={filters.category}
      //       onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      //       className="border rounded-md px-3 py-2"
      //     >
      //       {categories.map(cat => (
      //         <option key={cat.value} value={cat.value}>{cat.label}</option>
      //       ))}
      //     </select>

      //     <select
      //       value={filters.level}
      //       onChange={(e) => setFilters({ ...filters, level: e.target.value })}
      //       className="border rounded-md px-3 py-2"
      //     >
      //       {levels.map(level => (
      //         <option key={level.value} value={level.value}>{level.label}</option>
      //       ))}
      //     </select>
      //   </div>

      //   {/* 강좌 목록 */}
      //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      //     {filteredCourses.map(course => (
      //       <CourseCard
      //         key={course.id}
      //         course={course}
      //         type="course"
      //       />
      //     ))}
      //   </div>
      // </div>

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
          {courses.map(course => (
              <CourseCard
                  key={course.id}
                  course={course}
              />
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
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