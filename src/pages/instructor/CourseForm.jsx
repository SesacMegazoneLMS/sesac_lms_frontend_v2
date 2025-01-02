import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

function CourseForm({ initialData, onSubmit }) {
  const [courseData, setCourseData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'programming',
    level: initialData?.level || 'beginner',
    price: initialData?.price || 0,
    thumbnail: initialData?.thumbnail || '',
    objectives: initialData?.objectives || [''],
    requirements: initialData?.requirements || [''],
    status: initialData?.status || 'draft'
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnail || '');

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setCourseData({ ...courseData, thumbnail: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...courseData[field]];
    newArray[index] = value;
    setCourseData({ ...courseData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setCourseData({
      ...courseData,
      [field]: [...courseData[field], '']
    });
  };

  const removeArrayField = (field, index) => {
    const newArray = courseData[field].filter((_, i) => i !== index);
    setCourseData({ ...courseData, [field]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(courseData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
        <div className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">설명</label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData({...courseData, description: e.target.value})}
              rows={4}
              className="mt-1 block w-full border rounded-md p-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700">난이도</label>
              <select
                value={courseData.level}
                onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                className="mt-1 block w-full border rounded-md p-2"
              >
                <option value="beginner">입문</option>
                <option value="intermediate">중급</option>
                <option value="advanced">고급</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 썸네일 업로드 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">썸네일</h2>
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Course thumbnail"
                className="h-32 w-32 object-cover rounded-lg"
              />
            ) : (
              <div className="h-32 w-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                <FiUpload className="text-gray-400" size={24} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              onChange={handleThumbnailChange}
              accept="image/*"
              className="hidden"
              id="thumbnail-upload"
            />
            <label
              htmlFor="thumbnail-upload"
              className="inline-block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              이미지 업로드
            </label>
            <p className="mt-2 text-sm text-gray-500">
              권장 크기: 1280x720px (16:9 비율)
            </p>
          </div>
        </div>
      </div>

      <button type="submit" className="w-full bg-primary text-white p-3 rounded-md hover:bg-primary-dark">
        {initialData ? '강좌 수정하기' : '강좌 만들기'}
      </button>
    </form>
  );
}

export default CourseForm;