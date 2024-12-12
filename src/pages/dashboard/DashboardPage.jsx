import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';

function DashboardPage() {
  const { user } = useSelector(state => state.auth);

  // 로그인하지 않은 경우
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // role이 instructor인 경우 InstructorDashboard 렌더링
  if (user.role === 'instructor') {
    return <InstructorDashboard />;
  }

  // 기본값으로 StudentDashboard 렌더링
  return <StudentDashboard />;
}

export default DashboardPage;