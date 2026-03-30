import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // --- 1. LOGIC ĐĂNG KÝ THẬT ---
  const register = async (name, email, password) => {
    try {
      // Gửi dữ liệu xuống API Backend (cổng 5000)
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password
      });

      // Nếu Backend trả về thành công
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      // Lấy thông báo lỗi từ Backend (Ví dụ: "Email đã tồn tại!")
      return { 
        success: false, 
        message: error.response?.data?.message || "Lỗi kết nối server!" 
      };
    }
  };

// --- 2. LOGIC ĐĂNG NHẬP THẬT ---
// AuthContext.jsx
const login = async (email, password) => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
    if (res.data.success) {
      setUser(res.data.user);
      
      // LƯU CẢ 2 CÁI NÀY NÈ TIÊN:
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      localStorage.setItem('token', res.data.token); // <--- THÊM DÒNG NÀY (Đảm bảo Backend trả về res.data.token)
      
      return { success: true, user: res.data.user };
    }
  } catch (error) {
    return { success: false, message: "Sai tài khoản hoặc mật khẩu!" };
  }
};
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};