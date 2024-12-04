import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function DashboardHeader() {
  const { user } = useSelector(state => state.auth);
  
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">마이페이지</h1>
      <div className="flex space-x-4">
        <Link to="/profile" className="text-primary hover:text-primary-dark">
          프로필 관리
        </Link>
        {user?.role === 'student' && (
          <Link to="/certificates" className="text-primary hover:text-primary-dark">
            수료증 관리
          </Link>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;