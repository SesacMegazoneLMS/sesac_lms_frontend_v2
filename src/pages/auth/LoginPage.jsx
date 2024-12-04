import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { authService } from '../../infrastructure/services/authService';
import { toast } from 'react-toastify';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: "ap-northeast-2_78HNDcTxY",
  ClientId: "4v0l18pe5gjvlv6jdmvarf5dck"
});

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
  });

  const handleForgotPassword = async (email) => {
    try {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      });

      cognitoUser.forgotPassword({
        onSuccess: () => {
          toast.success('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
        },
        onFailure: (err) => {
          toast.error('비밀번호 재설정 요청에 실패했습니다.');
        }
      });
    } catch (error) {
      toast.error('비밀번호 재설정 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    
    try {
      const user = await authService.login(
        formData.email, 
        formData.password,
        formData.userType
      );
      
      // 디버깅을 위한 로그 추가
      console.log('User Attributes:', user);
      console.log('UserType from Cognito:', user.role);
      console.log('Requested UserType:', formData.userType);
      
      // user 객체를 그대로 사용
      localStorage.setItem('accessToken', user.token);
      localStorage.setItem('idToken', user.idToken); 
      localStorage.setItem('refreshToken', user.refreshToken);

      dispatch(loginSuccess(user));
      
      toast.success('로그인에 성공했습니다.');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        toast.info('이메일 인증이 필요합니다.');
        navigate('/auth/confirm-email', { 
          state: { email: formData.email } 
        });
      } else {
        const errorMessage = err.message || '로그인에 실패했습니다.';
        dispatch(loginFailure(errorMessage));
        toast.error(errorMessage);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=785935071013-ms26qfbn4tiu4kui0leu7la8m3f18v5h.apps.googleusercontent.com&redirect_uri=https://ap-northeast-2cj4nax3ku.auth.ap-northeast-2.amazoncognito.com/oauth2/idpresponse&response_type=code&scope=email profile`;
      
      // 현재 URL을 state로 저장
      localStorage.setItem('preLoginPage', window.location.pathname);
      
      // 사용자 유형도 저장
      localStorage.setItem('userType', formData.userType);
      
      window.location.href = googleAuthUrl;
    } catch (error) {
      toast.error('Google 로그인에 실패했습니다.');
      console.error('Google login error:', error);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
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
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/auth/register" className="font-medium text-primary hover:text-primary-dark">
                회원가입
              </Link>
            </div>
            <div className="text-sm">
              <button 
                type="button"
                onClick={() => handleForgotPassword(formData.email)}
                className="font-medium text-primary hover:text-primary-dark"
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">간편 로그인</span>
            </div>
          </div>
          <div className="mt-6 flex flex-col space-y-4">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <img className="h-5 w-5" src="/icons/kakao.png" alt="Kakao" />
              <span className="ml-2">카카오로 시작하기</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <img className="h-5 w-5" src="/icons/naver.png" alt="Naver" />
              <span className="ml-2">네이버로 시작하기</span>
            </button>
            <button 
              onClick={handleGoogleLogin}
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <img className="h-5 w-5" src="/icons/google.png" alt="Google" />
              <span className="ml-2">구글로 시작하기</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <img className="h-5 w-5" src="/icons/facebook.png" alt="Facebook" />
              <span className="ml-2">페이스북으로 시작하기</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <img className="h-5 w-5" src="/icons/github.png" alt="Github" />
              <span className="ml-2">Github로 시작하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;