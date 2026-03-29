import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Lấy danh sách người dùng từ Database
const fetchUsers = async () => {
  try {
    setLoading(true);
    // Gọi đúng đến cổng 5000 mà server đang chạy
    const res = await axios.get('http://localhost:5000/api/users'); 
    if (res.data.success) {
      setUsers(res.data.users); // Lưu vào state users
    }
  } catch (err) {
    console.error("Lỗi tải danh sách người dùng", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10 px-2">
        <h1 className="text-2xl font-bold text-[#881337] uppercase tracking-widest">
          Quản lý khách hàng
        </h1>
        <div className="bg-pink-50 text-[#881337] px-6 py-2 rounded-full text-xs font-bold border border-pink-100 shadow-sm">
          Tổng cộng: {users.length} thành viên
        </div>
      </div>

      <div className="bg-[#FEF2F4]/50 rounded-[2rem] p-4 border border-pink-100 shadow-inner">
        {/* Table Header */}
        <div className="grid grid-cols-4 p-5 text-xs font-bold uppercase tracking-widest text-[#881337]/70 text-center border-b border-pink-100">
          <span>Khách hàng</span>
          <span>Email</span>
          <span>Vai trò</span>
          <span>Thao tác</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-pink-50">
          {loading ? (
            <div className="p-20 text-center text-pink-300 italic">Đang tải danh sách thành viên...</div>
          ) : users.length === 0 ? (
            <div className="p-20 text-center text-gray-400 italic">Chưa có thành viên nào đăng ký.</div>
          ) : (
            users.map((user) => (
              <div key={user._id} className="grid grid-cols-4 p-6 items-center text-center hover:bg-white rounded-2xl transition-all group">
                {/* Cột Tên & Avatar */}
                <div className="flex items-center gap-4 text-left pl-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white text-[#881337] font-bold group-hover:scale-110 transition-transform">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-gray-800 text-sm">{user.name}</span>
                </div>

                {/* Cột Email */}
                <span className="text-gray-500 text-xs truncate px-2">{user.email}</span>

                {/* Cột Role */}
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    user.role === 'admin' 
                    ? 'bg-purple-50 text-purple-600 border-purple-100' 
                    : 'bg-pink-50 text-pink-500 border-pink-100'
                  }`}>
                    {user.role}
                  </span>
                </div>

                {/* Cột Thao tác */}
                <div className="flex justify-center gap-5 text-[11px] font-bold uppercase tracking-wider">
                  <button className="text-gray-400 hover:text-[#881337] transition-colors">Sửa</button>
                  <button className="text-gray-400 hover:text-red-500 transition-colors">Khóa</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;