import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; 

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/user/HomePage';
import Contact from './components/common/Contact';
import ProductDetail from './pages/user/ProductDetail'; 
import ProductList from './pages/user/ProductList';
import Login from './pages/user/LoginPage';
import UserProfile from './pages/user/UserProfile';
import CartPage from './pages/user/CartPage';       
import Checkout from './pages/Checkout';       
import AdminDashboard from './pages/admin/AdminDashboard';
import OrderTracking from './pages/user/OrderTracking';
import OrderDetail from './pages/user/OrderDetail';

// Route bảo vệ cho Admin
const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Layout dùng chung cho khách hàng
const UserLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#FFFDFD]">
    <Header />
    <main className="flex-grow">
      {children}
    </main>
    <Footer /> 
  </div>
);

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Trang Login không dùng Layout chung để đỡ rối */}
        <Route path="/login" element={<Login />} />

        {/* Route dành cho Admin */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        {/* CÁC TRANG USER - Tất cả bọc trong UserLayout */}
        <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
        <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
        <Route path="/product" element={<UserLayout><ProductList /></UserLayout>} />
        <Route path="/product-detail/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
        <Route path="/profile" element={<UserLayout><UserProfile /></UserLayout>} />
        
        {/* Route Theo dõi đơn hàng Tiên vừa làm nè */}
        <Route path="/orders" element={<UserLayout><OrderTracking /></UserLayout>} />
        <Route path="/order-detail/:id" element={<OrderDetail />} />
        
        {/* Giỏ hàng và Thanh toán */}
        <Route path="/cart" element={<UserLayout><CartPage /></UserLayout>} />
        <Route path="/checkout" element={<UserLayout><Checkout /></UserLayout>} />
        
        {/* Nếu gõ sai link thì quay về Trang chủ */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CartProvider>
  );
}

export default App;