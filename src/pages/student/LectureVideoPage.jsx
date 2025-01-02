// front/src/pages/lecture/LectureVideoPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { toast } from 'react-toastify';

const LectureVideoPage = () => {
  const { courseId, lectureId } = useParams();
  const [lectureData, setLectureData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [watchedTime, setWatchedTime] = useState(0);
  const playerRef = useRef(null);
  const navigate = useNavigate();

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

  // 토큰 확인 및 검증 함수 수정
  const getAuthToken = () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        console.error('Token not found in localStorage');
        return null;
      }

      // 토큰 디코딩하여 만료 여부 확인
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenData.exp * 1000; // milliseconds로 변환

      if (Date.now() >= expirationTime) {
        console.error('Token has expired');
        return null;
      }

      return token;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  // 진도율 저장 함수 수정
  const saveProgress = useCallback(async () => {
    try {
      const token = localStorage.getItem('idToken');
      if (!token) {
        console.error('No token found');
        navigate('/auth/login');
        return;
      }

      // 토큰 디코딩하여 로그
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', tokenPayload);

      console.log('Attempting to save progress...', {
        lectureId,
        progress: Math.round(progress * 100) / 100,
        watchedTime: Math.floor(watchedTime)
      });

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/lectures/${lectureId}/progress`,
        {
          progressRate: Math.round(progress * 100) / 100,
          watchedSeconds: Math.floor(watchedTime)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        console.log('Progress saved successfully');
      }

    } catch (error) {
      console.error('Progress save error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });

      if (error.response?.status === 401) {
        const token = localStorage.getItem('idToken');
        if (!token) {
          toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/auth/login');
          return;
        }
        // 토큰은 있지만 401이 발생한 경우
        toast.warning('인증에 문제가 있습니다. 잠시 후 다시 시도합니다.');
      } else {
        toast.error('진도율 저장에 실패했습니다.');
      }
    }
  }, [progress, watchedTime, lectureId, navigate]);

  // 비디오 진행 상태 모니터링 함수 수정
  const handleProgress = useCallback(({ played, playedSeconds }) => {
    console.log('Video progress:', {
      played: Math.round(played * 100) / 100,
      playedSeconds: Math.floor(playedSeconds)
    });

    setProgress(played * 100);
    setWatchedTime(Math.floor(playedSeconds));

    // 5초마다 진도 저장 (에러 처리 추가)
    if (Math.floor(playedSeconds) % 5 === 0) {
      try {
        saveProgress();
      } catch (error) {
        console.error('Progress save failed:', error);
        // 에러가 발생해도 비디오 재생은 계속됨
      }
    }
  }, [saveProgress]);

  // 영상 종료 시 처리
  const handleEnded = useCallback(async () => {
    try {
      await saveProgress();
      toast.success('강의를 완료했습니다!');
    } catch (error) {
      console.error('강의 완료 처리 실패:', error);
      toast.error('강의 완료 처리에 실패했습니다.');
    }
  }, [saveProgress]);

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
                ref={playerRef}
                url={lectureData.videoUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                config={{
                  file: {
                    forceHLS: true,
                  }
                }}
                onProgress={handleProgress}
                onEnded={handleEnded}
                progressInterval={5000} // 5초마다 진도 체크
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
              href={`/courses/${courseId}/lectures/${item.id}`}
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