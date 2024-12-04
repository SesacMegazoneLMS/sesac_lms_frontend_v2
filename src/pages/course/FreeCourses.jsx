import { useState, useEffect } from 'react';
import { getCourses } from '../../infrastructure/services/CourseService';
import CourseCard from '../../shared/components/CourseCard';

function FreeCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourses();
      const freeCourses = data.filter(course => course.price === 0);
      setCourses(freeCourses);
    };
    fetchCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">무료 강좌</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default FreeCourses;