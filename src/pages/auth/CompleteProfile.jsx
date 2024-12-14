import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../store/slices/authSlice";
import { AUTH_SERVICE } from "../../infrastructure/services/authService";
import { toast } from "react-toastify";

function CompleteProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const uuid = location.state?.uuid;

  useEffect(() => {
    if (!uuid) {
      toast.error("잘못된 접근입니다.");
      navigate("/", { replace: true });
    }
  }, [uuid, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    userType: "student",
    phoneNumber: "",
    countryCode: "+82",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phoneNumber || !formData.address) {
      toast.error("모든 필드를 입력해주세요.");
      return;
    }

    AUTH_SERVICE.exchangeCode(
      uuid,
      formData.name,
      formData.userType,
      `${formData.countryCode}${formData.phoneNumber}`,
      formData.address
    )
      .then(() => {
        // 토큰 저장
        localStorage.setItem("accessToken", location.state?.accessToken);
        localStorage.setItem("idToken", location.state?.idToken);
        localStorage.setItem("refreshToken", location.state?.refreshToken);

        return axios.get("https://api.sesac-univ.click/api/users/profile/", {
          headers: { Authorization: `Bearer ${location.state?.idToken}` },
        });
      })
      .then(({ data }) => {
        const { email, nickname, userType } = data.user;
        dispatch(
          loginSuccess({
            email,
            name: nickname,
            role: userType.toLowerCase(),
          })
        );

        toast.success("프로필이 완성되었습니다.");
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        console.error(error);
        toast.error("프로필 저장 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl p-8 space-y-6">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="text-center mb-12">
          <p className="mt-3 text-sm text-gray-500">
            더 나은 서비스 이용을 위해 기본 정보를 입력해주세요
          </p>
        </div>
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              사용자 유형
            </label>
            <select
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={formData.userType}
              onChange={(e) =>
                setFormData({ ...formData, userType: e.target.value })
              }
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
                onChange={(e) =>
                  setFormData({ ...formData, countryCode: e.target.value })
                }
              >
                <option value="+82">+82</option>
                <option value="+1">+1</option>
              </select>
              <input
                type="tel"
                required
                className="flex-1 block px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
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
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              프로필 완성하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
