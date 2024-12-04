function CourseForm({ initialData, onSubmit }) {
    const [courseData, setCourseData] = useState({
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'programming',
      level: initialData?.level || 'beginner',
      price: initialData?.price || 0,
      status: initialData?.status || 'draft'
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(courseData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">강좌명</label>
          <input
            type="text"
            value={courseData.title}
            onChange={(e) => setCourseData({...courseData, title: e.target.value})}
            className="mt-1 block w-full border rounded-md p-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">카테고리</label>
          <select 
            value={courseData.category}
            onChange={(e) => setCourseData({...courseData, category: e.target.value})}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="programming">프로그래밍</option>
            <option value="security">보안</option>
            <option value="data-science">데이터 사이언스</option>
          </select>
        </div>
  
        <button type="submit" className="w-full bg-primary text-white p-2 rounded-md">
          {initialData ? '수정하기' : '강좌 만들기'}
        </button>
      </form>
    );
  }