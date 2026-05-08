import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SporeBackground } from './components/SporeBackground.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SporeBackground />
    <App />
  </StrictMode>,
);
