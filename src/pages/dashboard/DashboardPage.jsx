import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import InstructorDashboard from './InstructorDashboard';

function DashboardPage() {
  const { user, loading } = useSelector(state => state.auth);

  console.log("Current auth state:", { user, loading });  // 디버깅용

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role === 'instructor') {
    return <InstructorDashboard />;
  }

  return <StudentDashboard />;
}

export default DashboardPage;