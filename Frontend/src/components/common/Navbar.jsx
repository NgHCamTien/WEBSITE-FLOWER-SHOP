import React from "react";
import { Link } from "react-router-dom";

// src/components/common/Navbar.jsx
const Navbar = () => {
  return (
    <nav className="bg-[#1e293b] text-white sticky top-[125px] z-40 w-full shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <ul className="flex items-center justify-center gap-12 text-sm font-semibold uppercase tracking-wider">
          <li><Link to="/" className="hover:text-pink-300 transition-colors">Trang chủ</Link></li>
          <li><Link to="/product" className="hover:text-pink-300 transition-colors">Sản phẩm</Link></li>
          <li className="group relative cursor-pointer hover:text-pink-300 transition-colors">
            Danh mục ▼
            {/* Dropdown Menu - UI sạch sẽ */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 hidden group-hover:block w-56 animate-fadeIn">
              <ul className="bg-white border border-pink-50 shadow-2xl rounded-2xl py-2 overflow-hidden text-gray-700 normal-case">
                 {/* Map Categories ở đây */}
              </ul>
            </div>
          </li>
          <li><Link to="/about" className="hover:text-pink-300 transition-colors">Giới thiệu</Link></li>
          <li><Link to="/contact" className="hover:text-pink-300 transition-colors">Liên hệ</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;