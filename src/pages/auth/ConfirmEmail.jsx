import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../infrastructure/services/authService';
import { toast } from 'react-toastify';

function ConfirmEmail() {
  const [code, setCode] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await authService.confirmSignUp(state.email, code);
      toast.success('이메일 인증이 완료되었습니다.');
      navigate('/auth/login');
    } catch (error) {
      toast.error('인증 코드가 올바르지 않습니다.');
    }
  };

  const handleResendCode = async () => {
    try {
      await authService.resendConfirmationCode(state.email);
      toast.success('인증 코드가 재전송되었습니다.');
    } catch (error) {
      toast.error('인증 코드 재전송에 실패했습니다.');
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="text-center text-2xl font-bold mb-4">이메일 인증</h2>
        <p className="text-center text-gray-600 mb-6">
          {state?.email}로 전송된 인증 코드를 입력해주세요.
        </p>
        <form onSubmit={handleConfirm}>
          <input
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증 코드 입력"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-primary text-white p-2 rounded"
          >
            인증 완료
          </button>
        </form>
        <button
          type="button"
          onClick={handleResendCode}
          className="mt-4 w-full text-sm text-primary hover:text-primary-dark"
        >
          인증 코드 재전송
        </button>
      </div>
    </div>
  );
}

export default ConfirmEmail;