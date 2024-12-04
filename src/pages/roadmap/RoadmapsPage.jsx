import React, { useState, useEffect } from 'react';
import RoadmapCard from '../../shared/components/RoadmapCard';
import roadmapsData from '../../infrastructure/mock/db/roadmaps.json';

function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [filters, setFilters] = useState({
    level: 'all',
    duration: 'all'
  });

  useEffect(() => {
    setRoadmaps(roadmapsData.roadmaps);
  }, []);

  const levels = [
    { value: 'all', label: '전체 레벨' },
    { value: '입문 → 중급', label: '입문 → 중급' },
    { value: '중급 → 고급', label: '중급 → 고급' },
    { value: '입문 → 고급', label: '입문 → 고급' }
  ];

  const durations = [
    { value: 'all', label: '전체 기간' },
    { value: '6', label: '6개월 이하' },
    { value: '12', label: '12개월 이하' }
  ];

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    if (filters.level !== 'all' && roadmap.level !== filters.level) return false;
    if (filters.duration !== 'all') {
      const months = parseInt(roadmap.duration);
      if (filters.duration === '6' && months > 6) return false;
      if (filters.duration === '12' && months > 12) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">학습 로드맵</h1>
      
      {/* 필터 섹션 */}
      <div className="flex gap-4 mb-8">
        <select 
          value={filters.level}
          onChange={(e) => setFilters({...filters, level: e.target.value})}
          className="border rounded-md px-3 py-2"
        >
          {levels.map(level => (
            <option key={level.value} value={level.value}>{level.label}</option>
          ))}
        </select>

        <select
          value={filters.duration}
          onChange={(e) => setFilters({...filters, duration: e.target.value})}
          className="border rounded-md px-3 py-2"
        >
          {durations.map(duration => (
            <option key={duration.value} value={duration.value}>{duration.label}</option>
          ))}
        </select>
      </div>

      {/* 로드맵 목록 */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRoadmaps.map(roadmap => (
          <RoadmapCard key={roadmap.id} roadmap={roadmap} />
        ))}
      </div>
    </div>
  );
}

export default RoadmapsPage;