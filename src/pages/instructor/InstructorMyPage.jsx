import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPlus, FiGlobe, FiUpload } from 'react-icons/fi';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { updateUserProfile } from '../../store/slices/authSlice';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

function InstructorMyPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState({
    bio: '',
    expertise: [],
    socialLinks: {
      website: '',
      linkedin: '',
      github: ''
    },
    profileImage: user?.profileImage || '/saesac.png'
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const uuid = uuidv4();
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const encodedEmail = btoa(user.email);
      const sourceS3Key = `profile/${encodedEmail}/${uuid}.${fileExtension}`;
      const cloudFrontUrl = `https://cdn.sesac-univ.click/${sourceS3Key}`;

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
        Bucket: "sesac-univ-profile",
        Key: sourceS3Key,
        Body: file,
        ContentType: file.type
      }));

      setProfileData(prev => ({
        ...prev,
        profileImage: cloudFrontUrl
      }));

      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/users/profile/instructor/img`,
        {
          profileImgUrl: cloudFrontUrl
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('idToken')}`
          }
        }
      );

      toast.success('프로필 이미지가 성공적으로 업데이트되었습니다.');

    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const transformToApiFormat = (data) => {
    return {
      introduction: data.bio,
      techStack: data.expertise.filter(skill => skill.trim() !== ''),
      websiteUrl: data.socialLinks.website,
      linkedinUrl: data.socialLinks.linkedin,
      githubUrl: data.socialLinks.github
    };
  };

  const handleAddExpertise = () => {
    if (profileData.expertise.some(skill => skill.trim() === '')) {
      toast.warning('비어있는 전문 분야를 먼저 입력해주세요.');
      return;
    }

    if (profileData.expertise.length >= 10) {
      toast.warning('전문 분야는 최대 10개까지 추가할 수 있습니다.');
      return;
    }

    setProfileData(prev => ({
      ...prev,
      expertise: [...prev.expertise, '']
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const requestData = {
        introduction: profileData.bio,
        techStack: profileData.expertise.filter(skill => skill.trim() !== ''),
        websiteUrl: profileData.socialLinks.website,
        linkedinUrl: profileData.socialLinks.linkedin,
        githubUrl: profileData.socialLinks.github
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/users/profile/instructor`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("idToken")}`
          }
        }
      );

      if (response.data.statusCode === 'OK') {
        toast.success('프로필이 성공적으로 저장되었습니다.');
        navigate('/dashboard');
      } else {
        throw new Error('프로필 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 저장 오류:', error);
      toast.error(error.message || '프로필 저장에 실패했습니다.');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/users/profile/instructor`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("idToken")}`
            }
          }
        );

        if (response.data.statusCode === 'OK') {
          const { profile } = response.data;
          setProfileData(prev => ({
            ...prev,
            bio: profile.introduction || '',
            expertise: profile.techStack || [],
            socialLinks: {
              website: profile.websiteUrl || '',
              linkedin: profile.linkedinUrl || '',
              github: profile.githubUrl || ''
            },
            profileImage: profile.profileImgUrl || '/saesac.png'
          }));
        }
      } catch (error) {
        toast.error('프로필 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="relative h-32 bg-primary-light">
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <img
                src={profileData.profileImage.startsWith('http')
                  ? profileData.profileImage  // CloudFront URL이면 그대로 사용
                  : '/saesac.png'  // 기본 이미지는 public 폴더에서 가져옴
                }
                alt="프로필"
                className="w-32 h-32 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white rounded-full p-2 shadow-md cursor-pointer transition-colors duration-200">
                <FiUpload className="w-5 h-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSaveProfile}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
            >
              저장
            </button>
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="pt-16 px-6 pb-6">
          <div className="space-y-4">
            {/* 자기소개 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">자기소개</h2>
              <div className="relative">
                <textarea
                  value={profileData.bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) { // 500자 제한
                      setProfileData(prev => ({ ...prev, bio: e.target.value }));
                    }
                  }}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder="자기소개를 입력해주세요"
                  maxLength={500} // HTML 기본 제한도 추가
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {profileData.bio.length}/500자
                </div>
              </div>
            </div>

            {/* 전문 분야 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">
                전문 분야
                <span className="text-sm text-gray-500 ml-2">
                  (최대 10개)
                </span>
              </h2>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {profileData.expertise.map((skill, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newExpertise = [...profileData.expertise];
                          newExpertise[index] = e.target.value;
                          setProfileData(prev => ({ ...prev, expertise: newExpertise }));
                        }}
                        className="bg-transparent w-24"
                        placeholder="기술명"
                      />
                      <button
                        onClick={() => {
                          const newExpertise = profileData.expertise.filter((_, i) => i !== index);
                          setProfileData(prev => ({ ...prev, expertise: newExpertise }));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleAddExpertise}
                    className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${profileData.expertise.length >= 10 ||
                        profileData.expertise.some(skill => skill.trim() === '')
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    disabled={
                      profileData.expertise.length >= 10 ||
                      profileData.expertise.some(skill => skill.trim() === '')
                    }
                    title={
                      profileData.expertise.length >= 10
                        ? '최대 개수에 도달했습니다'
                        : profileData.expertise.some(skill => skill.trim() === '')
                          ? '비어있는 전문 분야를 먼저 입력해주세요'
                          : '전문 분야 추가'
                    }
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 소셜 링크 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">소셜 링크</h2>
              <div className="space-y-2">
                {/* Website */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FiGlobe className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="w-20 text-gray-600">Website</span>
                  <input
                    type="url"
                    value={profileData.socialLinks.website}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        website: e.target.value
                      }
                    }))}
                    className="flex-1 px-3 py-2 border rounded"
                    placeholder="https://your-website.com"
                  />
                </div>

                {/* LinkedIn */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />
                  </div>
                  <span className="w-20 text-gray-600">LinkedIn</span>
                  <input
                    type="url"
                    value={profileData.socialLinks.linkedin}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        linkedin: e.target.value
                      }
                    }))}
                    className="flex-1 px-3 py-2 border rounded"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                {/* GitHub */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <FaGithub className="w-5 h-5 text-gray-800" />
                  </div>
                  <span className="w-20 text-gray-600">GitHub</span>
                  <input
                    type="url"
                    value={profileData.socialLinks.github}
                    onChange={(e) => setProfileData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        github: e.target.value
                      }
                    }))}
                    className="flex-1 px-3 py-2 border rounded"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorMyPage;