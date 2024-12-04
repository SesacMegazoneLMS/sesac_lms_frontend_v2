import { Link } from 'react-router-dom';
import defaultThumbnail from '../../assets/images/roadmaps/SpringBackend.png';
function RoadmapCard({ roadmap }) {
  return (
    <Link 
      to={`/roadmaps/${roadmap.id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="flex gap-4">
        <div className="w-1/3">
          <img 
            src={defaultThumbnail}
            alt={roadmap.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="w-2/3">
          <h3 className="font-bold text-lg mb-2">{roadmap.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{roadmap.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {roadmap.skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>난이도: {roadmap.level}</span>
            <span>예상 기간: {roadmap.duration}</span>
            <span>총 {roadmap.courseCount}개 강좌</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RoadmapCard;