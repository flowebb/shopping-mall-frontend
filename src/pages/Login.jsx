import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 토큰 확인 및 자동 리다이렉트
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        // localStorage 또는 sessionStorage에서 토큰 가져오기
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        if (!token) {
          return;
        }

        // 유저 정보 가져오기 시도
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
            // 토큰이 유효하고 유저 정보를 가져올 수 있으면 메인 페이지로 리다이렉트
            navigate('/');
          }
        } else {
          // 토큰이 유효하지 않으면 저장소에서 제거
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        }
      } catch (error) {
        console.error('토큰 확인 실패:', error);
      }
    };

    checkTokenAndRedirect();
  }, [navigate]);

  // 입력 필드 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      // 디버깅: 서버 응답 확인
      console.log('서버 응답:', data);
      console.log('토큰 존재 여부:', !!data.token);

      if (response.ok && data.success) {
        // 토큰 저장
        if (data.token) {
          if (keepLoggedIn) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.data));
            console.log('토큰이 localStorage에 저장되었습니다.');
          } else {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.data));
            console.log('토큰이 sessionStorage에 저장되었습니다.');
          }
        } else {
          console.warn('⚠️ 서버에서 토큰을 받지 못했습니다.');
          alert('로그인은 성공했지만 토큰을 받지 못했습니다. 서버 로그를 확인해주세요.');
        }
        
        alert('로그인 성공!');
        navigate('/');
      } else {
        // 서버에서 받은 에러 메시지 표시
        const errorMessage = data.message || '로그인에 실패했습니다.';
        
        // 에러 메시지를 적절한 필드에 표시
        if (errorMessage.includes('이메일') || errorMessage.includes('비밀번호')) {
          setErrors({
            email: errorMessage.includes('이메일') ? errorMessage : '',
            password: errorMessage.includes('비밀번호') ? errorMessage : '',
          });
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      
      // 네트워크 에러 또는 JSON 파싱 에러 처리
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">계정에 로그인하여 쇼핑을 시작하세요</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* 이메일 */}
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <div className="input-wrapper">
              <span className="input-icon">✉</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* 로그인 상태 유지 & 비밀번호 찾기 */}
          <div className="login-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
              <span>로그인 상태 유지</span>
            </label>
            <Link to="/forgot-password" className="forgot-password-link">
              비밀번호 찾기
            </Link>
          </div>

          {/* 로그인 버튼 */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="signup-link">
          <span>계정이 없으신가요? </span>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

