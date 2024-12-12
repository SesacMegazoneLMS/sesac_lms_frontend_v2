import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const UploadTest = () => {
  const [uploadStatus, setUploadStatus] = useState('');


  const token = localStorage.getItem('idToken');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const uploadVideo = async (file, lectureId) => {
    let sourceS3Key = `${Date.now()}-${file.name}`;
    let formattedDuration;

    // 비디오 길이 추출
    const getVideoDuration = (file) => {
      return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.src = URL.createObjectURL(file);
      });
    };

    try {
      // 먼저 비디오 길이를 가져옴
      const duration = await getVideoDuration(file);
      formattedDuration = new Date(duration * 1000).toISOString().substring(11, 19);
      console.log('Video duration:', formattedDuration); // 디버깅용

      setUploadStatus('업로드 시작...');

      const s3Client = new S3Client({
        region: "ap-northeast-2",
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: "ap-northeast-2" }),
          identityPoolId: "ap-northeast-2:45f6eb55-07a3-4c4d-871f-5a39e5d4194b",
          logins: {
            'cognito-idp.ap-northeast-2.amazonaws.com/ap-northeast-2_ow5oyt4jA': token
          }
        })
      });

      const command = new PutObjectCommand({
        Bucket: "hip-media-input",
        Key: sourceS3Key,
        Body: file,
        ContentType: file.type
      });

      await s3Client.send(command);
      setUploadStatus('업로드 완료!');

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(`업로드 실패: ${error.message}`);
    }

    // 2단계


    try {
      // 변환된 파일 이름을 동적으로 생성
      const videoKey = sourceS3Key.split('.')[0] + "/" + sourceS3Key.split('.')[0] + ".m3u8";

      // 백엔드에 비디오 정보 전송
      const response = await fetch('http://api.sesac-univ.click/api/lectures/video/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          lectureId: lectureId || 5, // lectureId가 없을 경우 기본값 설정
          videoKey: videoKey,
          status: 'COMPLETED',
          duration: formattedDuration
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update video status: ${response.status} - ${errorText}`);
      }

      setUploadStatus('업로드 완료!');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(`업로드 실패: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>비디오 업로드 테스트</h2>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            uploadVideo(file);
          }
        }}
      />
      {/* 업로드 상태 메시지를 보여주는 부분 추가 */}
      {uploadStatus && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: uploadStatus.includes('실패') ? '#ffebee' : '#e8f5e9',
          borderRadius: '4px',
          color: uploadStatus.includes('실패') ? '#c62828' : '#2e7d32'
        }}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default UploadTest;