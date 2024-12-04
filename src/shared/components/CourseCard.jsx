import defaultThumbnail from '../../assets/images/courses/SpringBoot.png';

const CourseCard = ({ course }) => {

    if (!course) return null;
  
    return (
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
        <div className="relative">
          <img 
            src={defaultThumbnail}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs">
            {course.totalHours}
          </span>
        </div>
        
        <div className="p-4">
          {/* 카테고리와 레벨 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">{course.category}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
              {course.level}
            </span>
          </div>
  
          {/* 제목 */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          {/* 강사명 */}
          <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
          
          {/* 평점과 수강생 */}
          <div className="flex items-center mb-3">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm font-medium text-gray-700">{course.rating}</span>
            <span className="text-sm text-gray-500 ml-2">
              ({course.students?.toLocaleString() ?? 0}명)
            </span>
          </div>
  
          {/* 가격 */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 line-through">
                ₩{(course.price * 1.2)?.toLocaleString()}
              </span>
              <span className="text-lg font-bold text-[#1dc120]">
                ₩{course.price?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="text-xs bg-[#fff7ed] text-[#ea580c] px-2 py-1 rounded">
              {course.totalLectures}개 강의
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CourseCard;