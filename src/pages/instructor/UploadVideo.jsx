import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const UploadVideo = ({ lectureId, onClose, onUploadComplete }) => {
  const [uploadStatus, setUploadStatus] = useState('');

  const token = localStorage.getItem('idToken');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const uploadVideo = async (file) => {
    let sourceS3Key = `${Date.now()}-${file.name}`;
    let formattedDuration;

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
      const duration = await getVideoDuration(file);
      formattedDuration = new Date(duration * 1000).toISOString().substring(11, 19);

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

      await s3Client.send(new PutObjectCommand({
        Bucket: "hip-media-input",
        Key: sourceS3Key,
        Body: file,
        ContentType: file.type
      }));

      const videoKey = sourceS3Key.split('.')[0] + "/" + sourceS3Key.split('.')[0] + ".m3u8";

      await fetch('http://api.sesac-univ.click/api/lectures/video/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          lectureId: lectureId,
          videoKey: videoKey,
          status: 'PROCESSING',
          duration: formattedDuration
        }),
      });

      setUploadStatus('업로드 완료!');
      onUploadComplete(videoKey);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(`업로드 실패: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">영상 업로드</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            uploadVideo(file);
          }
        }}
        className="w-full"
      />

      {uploadStatus && (
        <div className={`p-3 rounded ${uploadStatus.includes('실패') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
