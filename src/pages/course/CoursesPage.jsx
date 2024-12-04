import { useState, useEffect } from 'react';
import { getCourses } from '../../infrastructure/services/CourseService';
import CourseCard from '../../shared/components/CourseCard';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    priceRange: 'all'
  });

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'programming', label: '프로그래밍' },
    { value: 'frontend', label: '프론트엔드' },
    { value: 'backend', label: '백엔드' },
    { value: 'security', label: '보안' },
    { value: 'mobile', label: '모바일' },
    { value: 'devops', label: 'DevOps' }
  ];

  const levels = [
    { value: 'all', label: '전체 레벨' },
    { value: '초급', label: '초급' },
    { value: '중급', label: '중급' },
    { value: '고급', label: '고급' }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourses();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filters.category !== 'all' && course.category !== filters.category) return false;
    if (filters.level !== 'all' && course.level !== filters.level) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 강좌</h1>
      
      {/* 필터 섹션 */}
      <div className="flex gap-4 mb-8">
        <select 
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="border rounded-md px-3 py-2"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <select
          value={filters.level}
          onChange={(e) => setFilters({...filters, level: e.target.value})}
          className="border rounded-md px-3 py-2"
        >
          {levels.map(level => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>
      </div>

      {/* 강좌 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;