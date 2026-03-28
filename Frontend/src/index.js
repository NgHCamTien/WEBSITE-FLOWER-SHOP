import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // << PHẢI THÊM DÒNG NÀY VÀO ĐÂY
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext.jsx'; 
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);