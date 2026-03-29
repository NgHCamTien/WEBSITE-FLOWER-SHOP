import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const menuItems = ['Tổng quan', 'Sản phẩm', 'Danh mục', 'Đơn hàng', 'Người dùng'];

  return (
    <aside className="w-64 bg-white rounded-[2.5rem] flex flex-col items-center py-10 shadow-lg shadow-pink-100/50 h-full border border-pink-50">
      {/* Logo Area */}
      <div className="mb-12 text-center">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3 shadow-inner mx-auto border-4 border-white">
          <img src="/DDT-Photoroom.png" alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        <h2 className="text-sm font-bold tracking-[0.2em] text-[#881337] uppercase">
          DDT FLOWER
        </h2>
        <p className="text-[10px] text-pink-400 uppercase tracking-widest mt-1">Admin Panel</p>
      </div>

      {/* Menu Navigation */}
      <nav className="w-full px-6 space-y-3 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`w-full py-4 rounded-full text-sm transition-all flex items-center gap-3 px-6 ${
              activeTab === item 
                ? 'bg-[#FEF2F4] shadow-sm text-[#881337] font-bold border border-pink-100' 
                : 'text-gray-600 hover:bg-pink-50/50 hover:text-[#881337]'
            }`}
          >
            <span className="text-lg">{item === 'Tổng quan' ? '📊' : item === 'Sản phẩm' ? '💐' : item === 'Đơn hàng' ? '🛒' : '👥'}</span>
            {item}
          </button>
        ))}
      </nav>

      {/* Bottom Buttons */}
      <div className="w-full px-6 space-y-3 mt-auto pt-8 border-t border-pink-50">
        <button 
          onClick={() => navigate('/')} 
          className="w-full py-3.5 bg-[#FEF2F4] text-[#881337] rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all border border-pink-100"
        >
          Trang chủ
        </button>
        <button className="w-full py-3.5 bg-white text-red-400 rounded-full text-xs font-bold shadow-sm hover:bg-red-50 transition-all border border-red-100">
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;