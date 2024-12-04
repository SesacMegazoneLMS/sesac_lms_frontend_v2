import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/home/HomePage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import CourseDetailPage from '../pages/course/CourseDetailPage';
import LoginPage from '../pages/auth/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/course/:id', element: <CourseDetailPage /> },
      { path: '/course/create', element: <CourseCreatePage /> },
      { path: '/course/:id/edit', element: <CourseManagementPage /> }
    ]
  }
]);

export default router;