import { useEffect, useState } from 'react';
import { getCourses, getRoadmaps } from '../../infrastructure/services/CourseService';
import CourseCard from '../../shared/components/CourseCard';
import RoadmapCard from '../../shared/components/RoadmapCard';
import { Link } from 'react-router-dom';

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [coursesData, roadmapsData] = await Promise.all([
        getCourses(),
        getRoadmaps()
      ]);
      setCourses(coursesData);
      setRoadmaps(roadmapsData);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            새싹과 함께 성장하는 개발자의 여정
          </h1>
          <p className="text-xl mb-8">
            현업 전문가들과 함께하는 실전 강의로 <br />
            당신의 커리어를 성장시키세요
          </p>
          <Link to="/courses/free">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100">
              무료 강의 시작하기
            </button>
          </Link>
        </div>
      </section>

      {/* 인기 강좌 섹션 */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">인기 강좌</h2>
          <Link to="/courses" className="text-primary hover:text-primary-dark">
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* 로드맵 섹션 */}
      <section className="bg-gray-50 py-12 -mx-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">학습 로드맵</h2>
            <Link to="/roadmaps" className="text-primary hover:text-primary-dark">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.slice(0, 2).map(roadmap => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;