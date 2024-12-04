import { Outlet, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 프로모션 배너 */}
      <div className="bg-black text-white text-center py-2">
        <div className="max-w-7xl mx-auto px-4">
          💝 새싹 LMS 오픈 기념 전 강좌 20% 할인 이벤트 💝
        </div>
      </div>

      {/* 메인 헤더 */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
              <img 
                src="/saesac.png" 
                alt="새싹 LMS" 
                className="h-12 w-auto object-contain"
                style={{ aspectRatio: 'auto' }}
            />
            {/* 로고 영역 */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                새싹 LMS
              </Link>
            </div>

            {/* 검색창 */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="배우고 싶은 지식을 검색해보세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  🔍
                </button>
              </div>
            </div>

            {/* 네비게이션 메뉴 */}
            <nav className="flex items-center space-x-8">
              <Link to="/courses" className="text-gray-600 hover:text-primary">
                강좌
              </Link>
              <Link to="/roadmaps" className="text-gray-600 hover:text-primary">
                로드맵
              </Link>
              <Link to="/community" className="text-gray-600 hover:text-primary">
                커뮤니티
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                    마이페이지
                  </Link>
                  <span className="text-gray-700">{user.name}님</span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link to="/auth/login">
                  <button className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark">
                    로그인
                  </button>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 카테고리 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 py-4">
            <Link to="/category/programming" className="flex items-center space-x-2 text-gray-600 hover:text-primary">
              <img src="/icons/programming.png" alt="Programming" className="w-5 h-5" />
              <span>프로그래밍</span>
            </Link>
            <Link to="/category/security" className="flex items-center space-x-2 text-gray-600 hover:text-primary">
              <img src="/icons/security.png" alt="Security" className="w-5 h-5" />
              <span>보안</span>
            </Link>
            <Link to="/category/data-science" className="flex items-center space-x-2 text-gray-600 hover:text-primary">
              <img src="/icons/data.png" alt="Data Science" className="w-5 h-5" />
              <span>데이터 사이언스</span>
            </Link>
            <Link to="/category/design" className="flex items-center space-x-2 text-gray-600 hover:text-primary">
              <img src="/icons/design.png" alt="Design" className="w-5 h-5" />
              <span>디자인</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">새싹 LMS 소개</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-white">회사소개</Link></li>
                <li><Link to="/careers" className="text-gray-300 hover:text-white">채용정보</Link></li>
                <li><Link to="/press" className="text-gray-300 hover:text-white">보도자료</Link></li>
                <li><Link to="/partners" className="text-gray-300 hover:text-white">제휴문의</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">학습 지원</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-300 hover:text-white">자주묻는질문</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white">문의하기</Link></li>
                <li><Link to="/support" className="text-gray-300 hover:text-white">학습 가이드</Link></li>
                <li><Link to="/mentoring" className="text-gray-300 hover:text-white">멘토링 신청</Link></li>
                <li><Link to="/bug-report" className="text-gray-300 hover:text-white">버그 제보</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">이용안내</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-300 hover:text-white">이용약관</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white">개인정보처리방침</Link></li>
                <li><Link to="/refund" className="text-gray-300 hover:text-white">환불규정</Link></li>
                <li><Link to="/sitemap" className="text-gray-300 hover:text-white">사이트맵</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">새싹 LMS</h3>
              <div className="space-y-4">
                <div className="text-gray-300">
                  <p>고객센터: 1544-9001</p>
                  <p>평일 10:00 ~ 18:00</p>
                  <p>점심시간 13:00 ~ 14:00</p>
                </div>
                <div className="flex space-x-4 items-center">
                  <a 
                    href="https://facebook.com" 
                    className="social-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img 
                      src="/icons/facebook.png"
                      alt="Facebook" 
                      className="w-6 h-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    className="social-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img 
                      src="/icons/twitter.png"
                      alt="Twitter" 
                      className="w-6 h-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    className="social-icon"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img 
                      src="/icons/instagram.png" 
                      alt="Instagram" 
                      className="w-6 h-6 hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-400">
            <p>상호명: (주)새싹에듀 | 대표자: 김새싹 | 사업자등록번호: 123-45-67890</p>
            <p>통신판매업신고: 제2024-서울강남-1234호 | 개인정보보호책임자: 이새싹</p>
            <p>주소: 서울특별시 강남구 테헤란로 123 새싹빌딩 4층</p>
            <p className="mt-4">&copy; 2024 새싹 LMS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 채팅 상담 버튼 */}
      <button className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark">
        💬
      </button>
    </div>
  );
}

export default MainLayout;