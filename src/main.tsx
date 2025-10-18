import { NuqsAdapter } from 'nuqs/adapters/react';
import { createRoot } from 'react-dom/client';
import App from './App';
// import './index.css';
import './styles/index.scss';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <NuqsAdapter>
    <App />
  </NuqsAdapter>,
);
