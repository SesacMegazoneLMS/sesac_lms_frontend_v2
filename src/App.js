import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/home/HomePage";
import CourseDetailPage from "./pages/course/CourseDetailPage";
import CoursesPage from "./pages/course/CoursesPage";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import "react-toastify/dist/ReactToastify.css";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProfilePage from "./pages/profile/ProfilePage";
import CartPage from "./pages/cart/CartPage";
import CourseCreatePage from "./pages/instructor/CourseCreatePage";
import CourseManagementPage from "./pages/instructor/CourseManagementPage";
import CourseQuizPage from "./pages/instructor/CourseQuizPage";
import CourseContentPage from "./pages/instructor/CourseContentPage";
import RoadmapsPage from "./pages/roadmap/RoadmapsPage";
import FreeCourses from "./pages/course/FreeCourses";
import AuthCallback from "./pages/auth/AuthCallback";
import ConfirmEmail from "./pages/auth/ConfirmEmail";
import CommunityPage from "./pages/community/CommunityPage";
import InstructorMyPage from "./pages/instructor/InstructorMyPage";
import CompleteProfile from "./pages/auth/CompleteProfile";
import axios from "axios";
import { loginSuccess } from "./store/slices/authSlice";
import InstructorDashboard from "./pages/dashboard/InstructorDashboard";

const AppContent = ({ children }) => {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 추가

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const idToken = localStorage.getItem("idToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && idToken && refreshToken) {
        try {
          const infoResponse = await axios.get(
            "https://api.sesac-univ.click/api/users/profile/",
            { headers: { Authorization: `Bearer ${idToken}` } }
          );

          dispatch(
            loginSuccess({
              email: infoResponse.data.user.email,
              name: infoResponse.data.user.nickname,
              role: infoResponse.data.user.userType.toLowerCase(),
            })
          );
        } catch (err) {
          localStorage.clear();
          console.error("사용자 정보 조회 실패:", err);
        }
      }
      setIsLoading(false);  // 데이터 로딩 완료
    };

    fetchUserInfo();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;  // 또는 로딩 스피너 컴포넌트
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <AppContent>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="courses/free" element={<FreeCourses />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="roadmaps" element={<RoadmapsPage />} />
              <Route path="community" element={<CommunityPage />} />

              <Route path="instructor">
                <Route path="dashboard" element={<InstructorDashboard />} />
                <Route path="course/create" element={<CourseCreatePage />} />
                <Route path="course/:id/edit" element={<CourseManagementPage />} />
                <Route path="/instructor/course/:courseId/content" element={<CourseContentPage />} />
                <Route path="/instructor/course/:courseId/quiz" element={<CourseQuizPage />} />
                <Route path="/instructor/profile" element={<InstructorMyPage />} />
              </Route>
            </Route>

            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="callback" element={<AuthCallback />} />
              <Route path="confirm-email" element={<ConfirmEmail />} />
              <Route path="complete-profile" element={<CompleteProfile />} />
            </Route>
          </Routes>
        </Router>
      </AppContent>
    </Provider>
  );
}

export default App;