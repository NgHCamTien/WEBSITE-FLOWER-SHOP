import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // 1. Import CartContext mới tạo

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/user/HomePage';
import Contact from './components/common/Contact';
import ProductDetail from './pages/user/ProductDetail'; 
import ProductList from './pages/user/ProductList';
import Login from './pages/user/LoginPage';
import UserProfile from './pages/user/UserProfile';
import CartPage from './pages/user/CartPage';       // 2. Import trang Giỏ hàng
import Checkout from './pages/Checkout';       // 3. Import trang Thanh toán
import AdminDashboard from './pages/admin/AdminDashboard';

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const UserLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#FFFDFD]">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer /> {/* Thêm lại Footer cho đẹp nha Tiên */}
  </div>
);

function App() {
  return (
    // 4. Bọc toàn bộ App trong CartProvider để giỏ hàng chạy được ở mọi nơi
    <CartProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        {/* CÁC TRANG USER */}
        <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
        <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
        <Route path="/product" element={<UserLayout><ProductList /></UserLayout>} />
        <Route path="/product-detail/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
        <Route path="/profile" element={<UserLayout><UserProfile /></UserLayout>} />
        
        {/* 5. THÊM ROUTE CHO GIỎ HÀNG VÀ THANH TOÁN */}
        <Route path="/cart" element={<UserLayout><CartPage /></UserLayout>} />
        <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CartProvider>
  );
}

export default App;