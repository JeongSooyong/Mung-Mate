// React 기능을 사용하기 위해 React 라이브러리를 가져옵니다.
import {StrictMode} from 'react';
// 브라우저 화면에 React 앱을 연결하는 도구를 가져옵니다.
import {createRoot} from 'react-dom/client';
// 우리가 만든 메인 화면 컴포넌트를 가져옵니다.
import App from './App.tsx';
// 화면의 전체 디자인 규칙을 가져옵니다.
import './index.css';

// HTML에서 root라는 영역을 찾아 React 화면을 그립니다.
createRoot(document.getElementById('root')!).render(
  // 개발 중 잠재적인 문제를 찾아주는 React 엄격 모드를 시작합니다.
  <StrictMode>
    // 메인 애플리케이션 화면을 표시합니다.
    <App />
  // React 엄격 모드 영역을 닫습니다.
  </StrictMode>,
// 화면 렌더링 호출을 닫습니다.
);
