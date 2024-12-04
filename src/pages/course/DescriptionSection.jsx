import { FiCheck } from 'react-icons/fi';

function DescriptionSection({ course }) {
  return (
    <div className="space-y-8">
      {/* 학습 목표 */}
      <div>
        <h3 className="text-xl font-bold mb-4">학습 목표</h3>
        <ul className="space-y-3">
          {course.objectives.map((objective, index) => (
            <li key={index} className="flex items-start space-x-2">
              <FiCheck className="text-primary mt-1 flex-shrink-0" />
              <span>{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 수강 대상 */}
      <div>
        <h3 className="text-xl font-bold mb-4">수강 대상</h3>
        <ul className="space-y-3">
          {course.requirements.map((requirement, index) => (
            <li key={index} className="flex items-start space-x-2">
              <FiCheck className="text-primary mt-1 flex-shrink-0" />
              <span>{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 강사 소개 */}
      <div>
        <h3 className="text-xl font-bold mb-4">강사 소개</h3>
        <div className="flex items-start space-x-4">
          <img
            src={course.instructorImage || '/placeholder-avatar.jpg'}
            alt={course.instructor}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h4 className="font-medium mb-2">{course.instructor}</h4>
            <p className="text-gray-600">{course.instructorBio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DescriptionSection;