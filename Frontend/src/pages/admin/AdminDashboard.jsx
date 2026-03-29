import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProductManager from './ProductManager';
import Overview from './Overview';
import OrderManager from './OrderManager';
import UserManager from './UserManager';
import CategoryManager from './CategoryManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Sản phẩm');

  return (
    <div className="min-h-screen bg-[#FEF2F4] flex p-8 font-sans">
      {/* Sidebar bên trái giữ nguyên */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-10">
        {/* ĐÃ BỎ PHẦN HEADER CHÀO SẾP VÀ TIÊU ĐỀ Ở ĐÂY */}

        {/* Khung nội dung chính tràn lên trên cho thoáng */}
        <div className="bg-white rounded-[2.5rem] p-10 min-h-[750px] shadow-xl shadow-pink-100/50 relative border border-pink-50 overflow-hidden animate-in fade-in duration-500">
          
          {activeTab === 'Tổng quan' && <Overview />}

          {activeTab === 'Sản phẩm' && <ProductManager />}

          {activeTab === 'Đơn hàng' && <OrderManager />}
          {activeTab === 'Người dùng' && <UserManager />}
          {activeTab === 'Danh mục' && <CategoryManager />}

          {/* Các tab khác hiển thị nội dung trống nếu chưa làm */}
         
          
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;