import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './renderer.jsx';
import './index.css';
import './styles/app.css';
import './styles/layout.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
