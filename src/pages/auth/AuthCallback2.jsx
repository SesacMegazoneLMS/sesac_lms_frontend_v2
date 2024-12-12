// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 인증 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
          throw new Error("Authorization code not found");
        }

        // Lambda 함수 호출하여 토큰 교환
        const response = await axios.post(
          `https://ivdkhjbzl1.execute-api.ap-northeast-2.amazonaws.com/lms/auth/exchange-code`,
          { code },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.isProfileComplete) {
          // 토큰 저장
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("idToken", response.data.idToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          // 대시보드로 이동
          navigate("/dashboard");
        }
      } catch (error) {
        // 403: 프로필 미완성
        if (error.response?.status === 403) {
          navigate("/auth/complete-profile", {
            state: { uuid: error.response.data.uuid },
          });
          return;
        }

        // 그 외 에러
        console.error("Auth callback error:", error);
        navigate("/error");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">인증 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default AuthCallback2;
