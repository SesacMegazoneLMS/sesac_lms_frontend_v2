import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

const CourseContentPage = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({
    id: courseId,
    title: '',
    lectures: []
  });

  // 새 강의 입력을 위한 상태
  const [newLecture, setNewLecture] = useState({
    title: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // 강의 목록 조회
  const fetchCourseData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/lectures`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      });
      const lectures = response.data || [];
      const sortedLectures = lectures.sort((a, b) => a.orderIndex - b.orderIndex);
      setCourseData(prev => ({ ...prev, lectures: sortedLectures }));
    } catch (error) {
      console.error('Error fetching lectures:', error);
      toast.error('강의 목록을 불러오는데 실패했습니다.');
    }
  };

  // 비디오 업로드 함수
  const uploadVideo = async (file, lectureId) => {
    try {
      setIsUploading(true);
      let sourceS3Key = `${Date.now()}-${file.name}`;

      // 비디오 길이 추출
      const duration = await new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.src = URL.createObjectURL(file);
      });

      const formattedDuration = new Date(duration * 1000).toISOString().substring(11, 19);

      // S3 업로드
      const s3Client = new S3Client({
        region: "ap-northeast-2",
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: "ap-northeast-2" }),
          identityPoolId: "ap-northeast-2:45f6eb55-07a3-4c4d-871f-5a39e5d4194b",
          logins: {
            'cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_ow5oyt4jA': localStorage.getItem('idToken')
          }
        })
      });

      await s3Client.send(new PutObjectCommand({
        Bucket: "hip-media-input",
        Key: sourceS3Key,
        Body: file,
        ContentType: file.type
      }));

      const videoKey = sourceS3Key.split('.')[0] + "/" + sourceS3Key.split('.')[0] + ".m3u8";

      // 비디오 정보 업데이트
      await axios.post('/api/lectures/video/complete', {
        lectureId,
        videoKey,
        status: 'COMPLETED',
        duration: formattedDuration
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('idToken')}` }
      });

      toast.success('영상 업로드가 완료되었습니다.');
    } catch (error) {
      toast.error('영상 업로드에 실패했습니다.');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // 새 강의 생성
  const handleCreateLecture = async () => {
    if (!newLecture.title.trim()) {
      toast.warning('강의 제목을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/lectures', {
        courseId: parseInt(courseId),
        title: newLecture.title,
        orderIndex: courseData.lectures.length + 1,
        status: 'PENDING'
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('idToken')}` }
      });

      if (selectedFile) {
        await uploadVideo(selectedFile, response.data.id);
      }

      await fetchCourseData();
      setNewLecture({ title: '' });
      setSelectedFile(null);
      toast.success('새 강의가 생성되었습니다.');
    } catch (error) {
      toast.error('강의 생성에 실패했습니다.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">강의 콘텐츠 관리</h1>

      {/* 새 강의 생성 폼 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">새 강의 추가</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={newLecture.title}
              onChange={(e) => setNewLecture(prev => ({ ...prev, title: e.target.value }))}
              placeholder="강의 제목을 입력하세요"
              className="flex-1 px-4 py-2 border rounded"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 cursor-pointer"
            >
              영상 선택
            </label>
            {selectedFile && (
              <span className="text-sm text-gray-600">
                선택된 파일: {selectedFile.name}
              </span>
            )}
          </div>

          <button
            onClick={handleCreateLecture}
            disabled={!newLecture.title || !selectedFile || isUploading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isUploading ? '업로드 중...' : '강의 생성'}
          </button>
        </div>
      </div>

      {/* 강의 목록 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">강의 목록</h2>
        <div className="space-y-4">
          {courseData.lectures.map((lecture, index) => (
            <div key={lecture.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-500">
                    {String(index + 1).padStart(2, '0')}강
                  </span>
                  <span className="font-medium">{lecture.title}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {lecture.status === 'COMPLETED' ? '업로드 완료' : '처리 중'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseContentPage;