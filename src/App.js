import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import CourseDetailPage from './pages/course/CourseDetailPage';
import CoursesPage from './pages/course/CoursesPage';
import { Provider } from 'react-redux';
import { store } from './store/store';
import 'react-toastify/dist/ReactToastify.css';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import CartPage from './pages/cart/CartPage';
import CourseCreatePage from './pages/instructor/CourseCreatePage';
import CourseManagementPage from './pages/instructor/CourseManagementPage';
import CourseQuizPage from './pages/instructor/CourseQuizPage';
import CourseContentPage from './pages/instructor/CourseContentPage';
import RoadmapsPage from './pages/roadmap/RoadmapsPage';
import FreeCourses from './pages/course/FreeCourses';
import AuthCallback from './pages/auth/AuthCallback';
import ConfirmEmail from './pages/auth/ConfirmEmail';

function App() {
  return (
    <Provider store={store}>
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
            {/* 강사 전용 라우트 */}
            <Route path="instructor">
              <Route path="course/create" element={<CourseCreatePage />} />
              <Route path="course/:id/edit" element={<CourseManagementPage />} />
              <Route path="/instructor/course/:courseId/content" element={<CourseContentPage />} />
              <Route path="/instructor/course/:courseId/quiz" element={<CourseQuizPage />} />
            </Route>
          </Route>
          
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="callback" element={<AuthCallback />} />
            <Route path="confirm-email" element={<ConfirmEmail />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;