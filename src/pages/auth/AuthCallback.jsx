import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const userType = localStorage.getItem('userType') || 'student';
        
        if (code) {
          const tokenEndpoint = `https://ap-northeast-2cj4nax3ku.auth.ap-northeast-2.amazoncognito.com/oauth2/token`;
          const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: '4v0l18pe5gjvlv6jdmvarf5dck',
              code,
              redirect_uri: 'https://ap-northeast-2cj4nax3ku.auth.ap-northeast-2.amazoncognito.com/oauth2/idpresponse'
            })
          });

          if (!response.ok) {
            throw new Error('토큰 교환 실패');
          }

          const data = await response.json();
          
          // ID 토큰에서 사용자 정보 추출
          const payload = JSON.parse(atob(data.id_token.split('.')[1]));
          
          // Cognito 사용자 속성에서 userType 확인
          const cognitoUserType = payload['custom:userType'] || userType;

          console.log('Cognito User Type:', cognitoUserType);
          
          const user = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: cognitoUserType, // userType 대신 cognitoUserType 사용
            accessToken: data.access_token,
            idToken: data.id_token,
            refreshToken: data.refresh_token
          };

          console.log('User Object:', user);
          
          // 토큰들을 localStorage에 저장
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('idToken', data.id_token);
          localStorage.setItem('refreshToken', data.refresh_token);
          
          dispatch(loginSuccess(user));
          toast.success('구글 로그인 성공');
          
          // 이전 페이지로 돌아가기
          const prevPage = localStorage.getItem('preLoginPage') || '/dashboard';
          navigate(prevPage);
          
          // 임시 저장된 데이터 삭제
          localStorage.removeItem('preLoginPage');
          localStorage.removeItem('userType');
        } else {
          throw new Error('인증 코드가 없습니다.');
        }
      } catch (error) {
        console.error('Login Error:', error);
        toast.error('로그인 처리 중 오류가 발생했습니다.');
        navigate('/auth/login');
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold">로그인 처리 중...</h2>
        <p className="mt-2 text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

export default AuthCallback;