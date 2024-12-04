import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../infrastructure/services/authService';
import { toast } from 'react-toastify';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'student',
    phoneNumber: '',
    countryCode: '+82',
    address: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (!formData.phoneNumber) {
      toast.error('전화번호를 입력해주세요.');
      return;
    }

    if (!formData.address) {
      toast.error('주소를 입력해주세요.');
      return;
    }
  
    try {
      await authService.register(
        formData.email,
        formData.password,
        formData.name,
        formData.userType,
        `${formData.countryCode}${formData.phoneNumber}`,
        formData.address
      );
      toast.success('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
      navigate('/auth/confirm-email', { state: { email: formData.email } });
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        toast.error('이미 등록된 이메일입니다.');
      } else if (error.code === 'InvalidPasswordException') {
        toast.error('비밀번호는 특수문자, 숫자, 대문자를 포함해야 합니다.');
      } else {
        toast.error(error.message || '회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <p className="mt-1 text-xs text-gray-500">
              8자 이상, 특수문자, 숫자, 대문자를 포함해야 합니다
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              type="password"
              required
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              사용자 유형
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.userType}
              onChange={(e) => setFormData({...formData, userType: e.target.value})}
            >
              <option value="student">학생</option>
              <option value="instructor">강사</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              전화번호
            </label>
            <div className="mt-1 flex">
              <select
                className="w-24 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.countryCode}
                onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
              >
                <option value="+82">+82</option>
                <option value="+1">+1</option>
              </select>
              <input
                type="tel"
                required
                className="flex-1 block px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                placeholder="'-' 없이 입력"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              주소
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              회원가입
            </button>
          </div>

          <div className="text-sm text-center">
            <span className="text-gray-600">이미 계정이 있으신가요?</span>{' '}
            <Link to="/auth/login" className="font-medium text-primary hover:text-primary-dark">
              로그인하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;