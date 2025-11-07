import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 토큰 확인 및 유저 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        // localStorage 또는 sessionStorage에서 토큰 가져오기
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          setLoading(false);
          return;
        }

        // 유저 정보 가져오기
        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setUser(data.data);
          }
        } else {
          // 토큰이 유효하지 않으면 저장소에서 제거
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      } catch (error) {
        console.error('유저 정보 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="home">
      {/* 우측 상단 환영 메시지 */}
      {user && (
        <div className="welcome-message">
          <span>{user.name}님 반갑습니다.</span>
          <button onClick={handleLogout} className="logout-btn">
            로그아웃
          </button>
        </div>
      )}

      <h1>Shopping Mall</h1>
      <div className="home-content">
        {loading ? (
          <p>로딩 중...</p>
        ) : user ? (
          <p></p>
        ) : (
          <>
           
            <div className="button-group">
              <button 
                className="login-btn"
                onClick={() => navigate('/login')}
              >
                로그인
              </button>
              <button 
                className="signup-btn"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;

