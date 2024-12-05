import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiBook, FiUsers, FiSettings, FiBarChart2 } from 'react-icons/fi';

function InstructorLayout() {
  const location = useLocation();

  const navigationItems = [
    { path: '/instructor/dashboard', icon: <FiBarChart2 />, label: '대시보드' },
    { path: '/instructor/courses', icon: <FiBook />, label: '강좌 관리' },
    { path: '/instructor/students', icon: <FiUsers />, label: '수강생 관리' },
    { path: '/instructor/settings', icon: <FiSettings />, label: '설정' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/saesac.png" alt="새싹 LMS" className="h-8 w-auto" />
            <span className="text-xl font-bold text-primary">강사 페이지</span>
          </Link>
        </div>
        <nav className="mt-6">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary
                ${location.pathname === item.path ? 'bg-primary-light text-primary' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default InstructorLayout;
