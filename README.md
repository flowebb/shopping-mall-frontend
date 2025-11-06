# Shopping Mall Client

React + Vite를 사용한 쇼핑몰 클라이언트 프로젝트입니다.

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 3. 빌드

프로덕션 빌드:

```bash
npm run build
```

빌드 미리보기:

```bash
npm run preview
```

## 프로젝트 구조

```
client/
├── public/          # 정적 파일
├── src/
│   ├── assets/      # 이미지, 폰트 등
│   ├── App.jsx      # 메인 App 컴포넌트
│   ├── App.css      # App 스타일
│   ├── main.jsx     # 진입점
│   └── index.css    # 전역 스타일
├── index.html       # HTML 템플릿
├── vite.config.js   # Vite 설정
└── package.json     # 프로젝트 설정
```

## 주요 기능

- ⚡️ Vite를 사용한 빠른 개발 환경
- ⚛️ React 19
- 🔄 Hot Module Replacement (HMR)
- 🔌 API 프록시 설정 (포트 5000번 서버와 통신)
- 📦 최적화된 프로덕션 빌드

## API 통신

서버와의 통신은 `/api` 경로를 통해 프록시됩니다:

```javascript
fetch('/api/endpoint')
```

이 요청은 자동으로 `http://localhost:5000/endpoint`로 전달됩니다.

## 환경 변수

`.env` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```
VITE_API_URL=http://localhost:5000
```

환경 변수는 `import.meta.env.VITE_API_URL`로 접근할 수 있습니다.
