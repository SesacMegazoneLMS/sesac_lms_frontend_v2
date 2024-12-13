// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";

const AuthCallback2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      // URL에서 인증 코드 추출
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      try {
        if (!code) {
          throw new Error("Authorization code not found");
        }

        // Lambda 함수 호출하여 토큰 교환
        const response = await axios.post(
          `https://auth.sesac-univ.click/auth/exchange-code`,
          { code },
          { headers: { "Content-Type": "application/json" } }
        );

        const { accessToken, idToken, refreshToken, isProfileComplete } =
          response.data;

        if (isProfileComplete) {
          // 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("idToken", idToken);
          localStorage.setItem("refreshToken", refreshToken);

          const infoResponse = await axios.get(
            "http://localhost:8081/api/users/profile/",
            { headers: { Authorization: `Bearer ${idToken}` } }
          );

          console.error(infoResponse);

          const { email, nickname, userType } = infoResponse.data.user;

          dispatch(
            loginSuccess({
              email: email,
              name: nickname,
              role: userType.toLowerCase(),
            })
          );

          // 대시보드로 이동
          navigate("/dashboard");
        }
      } catch (error) {
        // 403: 프로필 미완성
        if (error.response?.status === 403) {
          const { uuid, accessToken, idToken, refreshToken } =
            error.response.data;

          navigate("/auth/complete-profile", {
            state: {
              uuid: uuid,
              accessToken: accessToken,
              idToken: idToken,
              refreshToken: refreshToken,
            },
          });
          return;
        }

        // 그 외 에러
        console.error("Auth callback error:", error);
        navigate("/error");
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

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
