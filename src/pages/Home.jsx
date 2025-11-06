import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Shopping Mall</h1>
      <div className="home-content">
        <p>쇼핑몰에 오신 것을 환영합니다!</p>
        <button 
          className="signup-btn"
          onClick={() => navigate('/signup')}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Home;

