import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
const BASE_URL = process.env.BASE_URL
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


