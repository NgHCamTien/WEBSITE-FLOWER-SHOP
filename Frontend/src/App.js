import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/user/HomePage';
import LoginPage from './pages/user/LoginPage'; // Thêm dòng này

// Giữ lại ProductList tạm thời nếu chưa tạo file
const ProductList = () => <div className="p-10 text-2xl">Trang danh sách sản phẩm</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;