import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { AUTH_ENDPOINTS } from "../../infrastructure/api/endpoints";
import { AUTH_SERVICE } from "../../infrastructure/services/authService";

const userPool = new CognitoUserPool({
  UserPoolId: "ap-northeast-2_ow5oyt4jA",
  ClientId: "6tuhkvilko0ea253l36d4n3uec",
});

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "student",
  });

  const handleForgotPassword = async (email) => {
    try {
      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
      });
      cognitoUser.forgotPassword({
        onSuccess: () => {
          toast.success("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
        },
        onFailure: (err) => {
          toast.error("비밀번호 재설정 요청에 실패했습니다.");
        },
      });
    } catch (error) {
      toast.error("비밀번호 재설정 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await AUTH_SERVICE.login(formData.email, formData.password);

      const { email, nickname, userType } = res.user;

      dispatch(
        loginSuccess({
          email: email,
          name: nickname,
          role: userType.toLowerCase(),
        })
      );

      toast.success("로그인에 성공했습니다.");
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "로그인에 실패했습니다.";

      if (err.response?.data?.type === "UserNotConfirmedException") {
        toast.info("이메일 인증이 필요합니다.");
        navigate("/auth/confirm-email", {
          state: { email: formData.email },
        });
      } else {
        dispatch(loginFailure(errorMessage));
        toast.error(errorMessage);
      }
    }
  };

  const handleKakaoLogin = async () => {
    try {
      window.location.href = AUTH_ENDPOINTS.kakao.url;
    } catch (error) {
      toast.error("Kakao 로그인에 실패했습니다.");
      dispatch(loginFailure(error));
    }
  };

  const handleNaverLogin = async () => {
    try {
      window.location.href = AUTH_ENDPOINTS.naver.url;
    } catch (error) {
      toast.error("Google 로그인에 실패했습니다.");
      dispatch(loginFailure(error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      window.location.href = AUTH_ENDPOINTS.google.url;
    } catch (error) {
      toast.error("Google 로그인에 실패했습니다.");
      dispatch(loginFailure(error));
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
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/auth/register"
                className="font-medium text-primary hover:text-primary-dark"
              >
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
            <button
              onClick={() => handleKakaoLogin()}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <img className="h-5 w-5" src="/icons/kakao.png" alt="Kakao" />
              <span className="ml-2">카카오로 시작하기</span>
            </button>
            <button
              onClick={handleNaverLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <img className="h-5 w-5" src="/icons/naver.png" alt="Naver" />
              <span className="ml-2">네이버로 시작하기</span>
            </button>
            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <img className="h-5 w-5" src="/icons/google.png" alt="Google" />
              <span className="ml-2">구글로 시작하기</span>
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <img
                className="h-5 w-5"
                src="/icons/facebook.png"
                alt="Facebook"
              />
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
