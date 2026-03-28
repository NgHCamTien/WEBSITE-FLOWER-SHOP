import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Hàm đăng nhập giả lập để bạn test giao diện
  const login = async (email, password) => {
    console.log("Đang đăng nhập với:", email);
    // Sau này bạn sẽ gọi API ở đây
    return { success: true, user: { name: "Cam Tien", role: "user" } };
  };

  const register = async (name, email, password) => {
    console.log("Đang đăng ký:", name);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};