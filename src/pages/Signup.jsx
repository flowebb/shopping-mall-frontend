import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'customer',
  });

  const [agreements, setAgreements] = useState({
    age14: false,
    terms: false,
    privacy: false,
    marketing: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 전체 동의
  const handleSelectAll = (checked) => {
    setAgreements(prev => ({
      ...prev,
      terms: checked,
      privacy: checked,
      marketing: checked,
    }));
  };

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

  // 체크박스 변경
  const handleAgreementChange = (name, checked) => {
    if (name === 'all') {
      handleSelectAll(checked);
    } else {
      setAgreements(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  // 폼 검증
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else {
      // 비밀번호 규칙: 영문 대소문자/숫자/특수문자 2종류 10~16자 또는 3종류 8~16자
      const hasUpper = /[A-Z]/.test(formData.password);
      const hasLower = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
      
      const typeCount = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
      const length = formData.password.length;

      if (!((typeCount >= 2 && length >= 10 && length <= 16) || (typeCount >= 3 && length >= 8 && length <= 16))) {
        newErrors.password = '비밀번호는 영문 대소문자/숫자/특수문자를 혼용하여 2종류 10~16자 또는 3종류 8~16자여야 합니다.';
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!agreements.age14) {
      newErrors.age14 = '만 14세 이상 동의는 필수입니다.';
    }

    if (!agreements.terms) {
      newErrors.terms = '이용약관 동의는 필수입니다.';
    }

    if (!agreements.privacy) {
      newErrors.privacy = '개인정보 수집 및 이용 동의는 필수입니다.';
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
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          user_type: formData.user_type,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('회원가입이 완료되었습니다!');
        navigate('/');
      } else {
        // 서버에서 받은 에러 메시지 표시
        const errorMessage = data.message || '회원가입에 실패했습니다.';
        alert(errorMessage);
        
        // 이메일 중복 에러인 경우 이메일 필드에 에러 표시
        if (errorMessage.includes('이메일')) {
          setErrors(prev => ({
            ...prev,
            email: errorMessage
          }));
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 연결에 실패했습니다. 네트워크를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>회원정보 입력</h1>
      
      <form onSubmit={handleSubmit} className="signup-form">
        {/* 이름 */}
        <div className="form-group">
          <label>
            * 이름
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
          </label>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label>
            * 이메일
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
          </label>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label>
            * 비밀번호
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
          </label>
          <p className="password-hint">
            (영문 대소문자/숫자/특수문자를 혼용하여 2종류 10~16자 또는 3종류 8~16자)
          </p>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label>
            * 비밀번호 확인
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
          </label>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        {/* 만 14세 이상 */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={agreements.age14}
              onChange={(e) => handleAgreementChange('age14', e.target.checked)}
            />
            <span className={errors.age14 ? 'error-text' : ''}>
              만 14세 이상입니다. (필수)
            </span>
          </label>
          {errors.age14 && <span className="error-message">{errors.age14}</span>}
          <p className="agreement-hint">
            14세 미만 아동의 경우 법정대리인 동의가 필요하며, 고객센터로 문의해주시기 바랍니다.
            <br />
            최소한의 정보만 수집하여 회원가입을 간편하게 진행할 수 있도록 하고 있습니다.
          </p>
        </div>

        {/* 전체 동의 */}
        <div className="form-group select-all-group">
          <label>
            <input
              type="checkbox"
              checked={agreements.terms && agreements.privacy && agreements.marketing}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="select-all-text">전체동의</span>
          </label>
        </div>

        {/* 약관 동의 박스 */}
        <div className="agreement-box">
          {/* [필수] 이용약관 */}
          <div className="agreement-item">
            <label>
              <input
                type="checkbox"
                checked={agreements.terms}
                onChange={(e) => handleAgreementChange('terms', e.target.checked)}
              />
              <span className={errors.terms ? 'error-text' : ''}>
                [필수] 이용약관
              </span>
            </label>
            <button type="button" className="view-details-btn">내용보기</button>
            {errors.terms && <span className="error-message">{errors.terms}</span>}
          </div>

          {/* [필수] 개인정보 수집 및 이용 안내 */}
          <div className="agreement-item">
            <label>
              <input
                type="checkbox"
                checked={agreements.privacy}
                onChange={(e) => handleAgreementChange('privacy', e.target.checked)}
              />
              <span className={errors.privacy ? 'error-text' : ''}>
                [필수] 개인정보 수집 및 이용 안내
              </span>
            </label>
            <button type="button" className="view-details-btn">내용보기</button>
            {errors.privacy && <span className="error-message">{errors.privacy}</span>}
          </div>

          {/* [선택] 마케팅 수신동의 */}
          <div className="agreement-item marketing-agreement">
            <label>
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={(e) => handleAgreementChange('marketing', e.target.checked)}
              />
              [선택] 마케팅 수신동의 (이메일 SMS, 카카오톡 등 앱Push알림)
            </label>
            <p className="marketing-description">
              회사의 서비스 정보, 홍보(마케팅 활동), 쿠폰등의 이벤트 행사 및 프로모션 정보를 보내드립니다.<br />
              동의를 거부하더라도 서비스 이용은 가능하나, 동의하지 않는 경우 마케팅 활용과 관련된<br />
              혜택의 제한이 있을 수 있습니다.<br />
              마케팅 수집동의를 해주셔야 경품당첨과 쿠폰 지급시 안내메세지가 발송됩니다.<br />
              단, 상품 구매 정보는 수신, 이용 동의 여부와 관계없이 발송됩니다.
            </p>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? '처리 중...' : '동의하고 가입완료'}
        </button>
      </form>
    </div>
  );
}

export default Signup;

