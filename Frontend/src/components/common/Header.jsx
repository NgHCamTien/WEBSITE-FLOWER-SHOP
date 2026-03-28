import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

const Header = () => {
  // Lấy dữ liệu từ Context (Đảm bảo bạn đã tạo file Context như mình hướng dẫn trước đó)
  const { user, logout } = useContext(AuthContext) || { user: null }; 
  const { cartItems } = useContext(CartContext) || { cartItems: [] };

  const headerRef = useRef(null);
  const cartCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <>
      <div ref={headerRef} className="fixed top-0 left-0 w-full z-50 shadow-sm">
        {/* TOP BAR */}
        <div className="bg-[#1e293b] text-white text-xs flex justify-between px-6 py-2">
          <p>🌸 DDT Flower Shop - Nơi gửi gắm yêu thương 🌸</p>
          <div className="flex gap-4">
            {user ? (
              <div className="flex gap-3">
                <span>Chào, {user.name}</span>
                <button onClick={logout} className="hover:text-pink-300">Đăng xuất</button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-pink-300">Đăng nhập / Đăng ký</Link>
            )}
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="bg-white border-b border-[#f0e2da] px-8 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-3">
              {/* <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center font-bold text-[#d15574]">DDT</div> */}
              <span className="text-2xl font-serif text-[#4b2c2b] font-semibold">DDT Flower</span>
            </Link>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <div className="flex items-center border border-[#f0e2da] rounded-full overflow-hidden bg-gray-50">
                <input
                  type="text"
                  placeholder="Tìm kiếm hoa tươi..."
                  className="flex-1 px-4 py-2 focus:outline-none bg-transparent text-sm"
                />
                <button className="bg-[#d15574] text-white px-5 py-2 hover:bg-[#b74662] transition">
                  Tìm
                </button>
              </div>
            </div>

            {/* Cart Icon */}
            <Link to="/cart" className="relative bg-[#d15574] text-white px-5 py-2 rounded-full flex items-center gap-2 hover:bg-[#b74662] transition shadow-md">
              <span>Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      {/* Spacer giúp nội dung không bị Header che mất */}
      <div className="h-[120px]"></div>
    </>
  );
};

export default Header;