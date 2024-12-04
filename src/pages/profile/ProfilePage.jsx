import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserProfile } from '../../store/slices/authSlice';

function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    address: user.address,
    phone: user.phone
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
      toast.success('프로필이 업데이트되었습니다.');
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">프로필 관리</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">이름</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">주소</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">전화번호</label>
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
                    저장
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button 
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  수정
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;