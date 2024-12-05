import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiUpload, FiSave } from 'react-icons/fi';

function InstructorMyPage() {
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    expertise: user?.expertise || [],
    education: user?.education || [],
    experience: user?.experience || [],
    socialLinks: user?.socialLinks || {
      website: '',
      linkedin: '',
      github: ''
    },
    profileImage: user?.profileImage || '/default-avatar.png'
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: API 연동 시 실제 저장 로직 구현
      toast.success('프로필이 저장되었습니다.');
      setIsEditing(false);
    } catch (error) {
      toast.error('프로필 저장에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 프로필 헤더 */}
        <div className="relative h-48 bg-primary-light">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <img
                src={profileData.profileImage}
                alt={profileData.name}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer">
                  <FiUpload className="text-primary" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <button
                onClick={handleSaveProfile}
                className="bg-primary text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FiSave className="mr-2" />
                저장
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-primary px-4 py-2 rounded-lg flex items-center"
              >
                <FiEdit2 className="mr-2" />
                수정
              </button>
            )}
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="pt-20 px-6 pb-6">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="text-2xl font-bold w-full px-3 py-2 border rounded"
                    placeholder="이름을 입력하세요"
                  />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded text-gray-500"
                    placeholder="이메일을 입력하세요"
                    disabled
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  <p className="text-gray-500 mt-1">{profileData.email}</p>
                </div>
              )}
            </div>

            {/* 자기소개 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">자기소개</h2>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                  placeholder="자기소개를 입력해주세요"
                />
              ) : (
                <p className="text-gray-600">{profileData.bio || '자기소개를 입력해주세요.'}</p>
              )}
            </div>

            {/* 전문 분야 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">전문 분야</h2>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {profileData.expertise.map((skill, index) => (
                      <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => {
                            const newExpertise = [...profileData.expertise];
                            newExpertise[index] = e.target.value;
                            setProfileData({...profileData, expertise: newExpertise});
                          }}
                          className="bg-transparent w-24"
                          placeholder="기술명"
                        />
                        <button
                          onClick={() => {
                            const newExpertise = profileData.expertise.filter((_, i) => i !== index);
                            setProfileData({...profileData, expertise: newExpertise});
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setProfileData({
                      ...profileData,
                      expertise: [...profileData.expertise, '']
                    })}
                    className="text-primary hover:text-primary-dark flex items-center"
                  >
                    <span className="mr-1">+</span> 전문 분야 추가
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.expertise.map((skill, index) => (
                    <span key={index} className="bg-gray-100 rounded-full px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 소셜 링크 */}
            <div>
              <h2 className="text-lg font-semibold mb-2">소셜 링크</h2>
              {isEditing ? (
                <div className="space-y-2">
                  {Object.entries(profileData.socialLinks).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <span className="w-20 text-gray-600 capitalize">{key}</span>
                      <input
                        type="url"
                        value={value}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialLinks: {
                            ...profileData.socialLinks,
                            [key]: e.target.value
                          }
                        })}
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder={`${key} URL을 입력하세요`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(profileData.socialLinks).map(([key, value]) => (
                    value && (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary hover:text-primary-dark"
                      >
                        <span className="capitalize">{key}</span>
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorMyPage;