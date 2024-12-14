// front/src/pages/lecture/LectureVideoPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { toast } from 'react-toastify';

const LectureVideoPage = () => {
  const { courseId, lectureId } = useParams();
  const [lectureData, setLectureData] = useState(null);

  useEffect(() => {
    fetchLectureData();
  }, [courseId, lectureId]);

  const fetchLectureData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/lectures/course/${courseId}/video/${lectureId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('idToken')}`
          }
        }
      );
      setLectureData(response.data);
    } catch (error) {
      console.error('Error fetching lecture:', error);
      toast.error('강의 정보를 불러오는데 실패했습니다.');
    }
  };

  if (!lectureData) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 상단 정보 바 */}
        <div className="bg-white shadow p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">{lectureData.courseTitle}</h1>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>{`${lectureData.orderIndex}강. ${lectureData.title}`}</span>
              <span className="mx-2">•</span>
              <span>{lectureData.duration}</span>
            </div>
          </div>
        </div>

        {/* 비디오 플레이어 */}
        <div className="flex-1 p-4">
          <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
            {lectureData.status === 'COMPLETED' ? (
              <ReactPlayer
                url={lectureData.videoUrl}
                width="100%"
                height="100%"
                controls
                playing
                config={{
                  file: {
                    forceHLS: true,
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white">동영상 처리 중입니다...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 우측 네비게이션 바 */}
      <div className="w-80 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">강의 목차</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {lectureData.navigation.map((item) => (
            <a
              key={item.id}
              href={`/course/${courseId}/lecture/${item.id}`}
              className={`block p-4 hover:bg-gray-50 border-b ${item.id === lectureData.id ? 'bg-blue-50' : ''
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{`${item.orderIndex}강. ${item.title}`}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.duration}</p>
                </div>
                {item.status === 'COMPLETED' ? (
                  <span className="text-green-500 text-sm">시청 가능</span>
                ) : (
                  <span className="text-gray-400 text-sm">처리 중</span>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LectureVideoPage;