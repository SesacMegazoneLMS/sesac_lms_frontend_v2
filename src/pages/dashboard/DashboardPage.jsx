import React from 'react';
import { useSelector } from 'react-redux';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';

function DashboardPage() {
  const { user } = useSelector(state => state.auth);

  // role이 instructor인 경우 InstructorDashboard 렌더링
  if (user?.role === 'instructor') {
    return
    <>
      <InstructorDashboard />;
      <StudentDashboard />;
    </>

  }

  // 기본값으로 StudentDashboard 렌더링
  return <StudentDashboard />;
}

export default DashboardPage;