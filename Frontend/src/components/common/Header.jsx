import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { FaClipboardCheck, FaSearch, FaShoppingCart } from "react-icons/fa";
import Navbar from "./Navbar";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext) || { cartItems: [] };
  const navigate = useNavigate();
  const location = useLocation();

  const headerRef = useRef(null);
  const searchWrapperRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // ... (Giữ nguyên các useEffect logic tìm kiếm của bạn) ...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("q") || "");
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/products/suggest?q=${encodeURIComponent(searchTerm.trim())}`,
          { signal: controller.signal }
        );
        setSuggestions(res.data.results || []);
        setShowSuggestions(true);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Suggest error:", err);
        }
      }
    }, 250);
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      setShowSuggestions(false);
      navigate(`/product?q=${encodeURIComponent(q)}`);
    }
  };

  const handleSuggestionClick = (id) => {
    setShowSuggestions(false);
    setSearchTerm("");
    navigate(`/product-detail/${id}`);
  };

  return (
    <>
      <header 
        ref={headerRef} 
        className="fixed top-0 left-0 w-full z-[100] bg-white shadow-md"
      >
        {/* 1. TOP BAR */}
        <div className="relative z-[110] bg-gray-800 text-white text-[11px] flex justify-between px-6 py-1.5 font-sans">
          <p>🌸 DDT Flower Shop - Nơi gửi gắm yêu thương 🌸</p>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link to="/profile" className="hover:text-pink-300 transition">Chào, {user.name}</Link>
                <button onClick={logout} className="hover:text-pink-300 transition border-l border-gray-600 pl-4">Đăng xuất</button>
              </>
            ) : (
              <Link to="/login" className="hover:text-pink-300 transition cursor-pointer relative z-[120]">Đăng nhập</Link>
            )}
          </div>
        </div>

        {/* 2. MAIN HEADER */}
        <div className="relative z-[110] bg-[#fffdfd] border-b border-[#f0e2da] px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <img src="/DDT.png" alt="Logo" className="w-12 h-12 rounded-full border border-pink-50 shadow-sm transition-transform group-hover:scale-105" />
              <span className="text-2xl font-serif text-[#4b2c2b] font-bold tracking-tight">DDT Flower</span>
            </Link>

            {/* Search */}
            <div className="relative flex-1 max-w-xl" ref={searchWrapperRef}>
              <form 
                onSubmit={handleSearchSubmit} 
                className="flex items-center border border-pink-100 rounded-full overflow-hidden bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-100 transition-all shadow-inner"
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Tìm kiếm hoa tươi, dịp tặng..."
                  className="flex-1 px-5 py-2.5 bg-transparent focus:outline-none text-[#4b2c2b] text-sm"
                />
                <button type="submit" className="bg-[#d15574] text-white px-6 py-2.5 hover:bg-[#b74662] transition-colors">
                  <FaSearch />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-pink-50 rounded-2xl shadow-xl max-h-80 overflow-y-auto z-[150] animate-fadeIn">
                  {suggestions.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSuggestionClick(item._id)}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-pink-50 transition-colors text-left border-b border-pink-50 last:border-0"
                    >
                      {item.thumbnail && (
                        <img 
                          src={`${API_URL}${item.thumbnail}`} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-pink-100" 
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-[#4b2c2b] text-sm line-clamp-1">{item.name}</p>
                        <p className="text-[#e06c7f] font-bold text-xs">
                          {(item.discountPrice || item.price).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {/* 👑 NÚT QUẢN LÝ DÀNH RIÊNG CHO ADMIN */}
              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#881337] text-white text-sm font-bold hover:bg-[#6b0f2a] transition-all shadow-md active:scale-95"
                >
                  📊 Quản lý
                </Link>
              )}
            <div className="flex items-center gap-4 shrink-0">
              {user && (
                <Link
                  to="/payment-tracking"
                  className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#fff0f4] text-[#e06c7f] text-sm font-medium hover:bg-[#ffe1ea] transition-all shadow-sm"
                >
                  <FaClipboardCheck /> Theo dõi đơn
                </Link>
              )}

              <Link
                to="/cart"
                className="relative bg-[#d15574] text-white px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#b74662] transition-all shadow-md active:scale-95"
              >
                <FaShoppingCart />
                <span className="font-bold text-sm text-white">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* 3. NAVBAR - Đặt cuối Header để nó nằm dưới cùng của thanh điều hướng */}
        <Navbar />
      </header>

      {/* 🌸 THẺ ĐỆM SPACER: Chỉnh lại để không bị quá cao hoặc quá thấp */}
     <div className="h-[120px] md:h-[135px]" />
    </>
  );
};

export default Header;