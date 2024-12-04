import { Link, Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/saesac.png"
            alt="새싹 LMS"
            className="h-12 w-auto object-contain"
            style={{ aspectRatio: 'auto' }}
          />
          <span className="text-2xl font-bold text-primary">새싹 LMS</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <p className="mt-2 text-center text-sm text-gray-600">
          성장하는 개발자들의 온라인 학습 플랫폼
        </p>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;