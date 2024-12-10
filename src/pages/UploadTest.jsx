import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import VideoPlayer from '../pages/VideoPlayer';

const UploadTest = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [videoSrc, setVideoSrc] = useState('https://dt9kc2k4h1nps.cloudfront.net/1733816378330-test_720pFH/1733816378330-test_720pFH.m3u8');

  const token = localStorage.getItem('idToken');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const uploadVideo = async (file, lectureId) => {
    let sourceS3Key = `${Date.now()}-${file.name}`;
    try {
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

      const response = await fetch('http://localhost:8081/api/lectures/video/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          lectureId: 3,
          videoKey: videoKey,
          status: 'COMPLETED'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update video status: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error calling backend:', error);
      throw error;
    }

    // const UploadTest = () => {
    //   const [uploadStatus, setUploadStatus] = useState('');
    //   const [videoSrc, setVideoSrc] = useState('https://dt9kc2k4h1nps.cloudfront.net/1733816378330-test_720pFH/1733816378330-test_720pFH.m3u8');

    // };
  }

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
      <VideoPlayer src={videoSrc} />
    </div>
  );
};

export default UploadTest;