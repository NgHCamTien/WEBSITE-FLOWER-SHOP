import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  // Dữ liệu mẫu cho lịch sử đơn hàng
  const orders = [
    { id: '#DDT101', date: '28/03/2026', total: '550.000đ', status: 'Đang giao' },
    { id: '#DDT095', date: '15/03/2026', total: '1.200.000đ', status: 'Đã hoàn thành' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFD] flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 mt-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR TRÁI --- */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-6 text-center">
              <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto flex items-center justify-center text-[#e06c7f] text-3xl font-bold mb-4">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user?.name || 'Khách hàng'}</h2>
              <p className="text-sm text-gray-500 mb-6">{user?.email}</p>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-[#f9d5df] text-[#e06c7f] font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  👤 Thông tin cá nhân
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-[#f9d5df] text-[#e06c7f] font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  📦 Lịch sử đơn hàng
                </button>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
                >
                  🚪 Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* --- NỘI DUNG PHẢI --- */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-pink-50 p-8 min-h-[500px]">
              
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Họ và tên</label>
                      <input 
                        type="text" 
                        disabled 
                        className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-gray-600" 
                        value={user?.name} 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                      <input 
                        type="email" 
                        disabled 
                        className="w-full mt-1 p-3 bg-gray-50 border rounded-xl text-gray-600" 
                        value={user?.email} 
                      />
                    </div>
                  </div>
                  <button className="mt-8 bg-[#e06c7f] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d35d75] transition-all shadow-lg shadow-pink-100">
                    Cập nhật thông tin
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Đơn hàng của bạn</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-gray-400 text-xs uppercase font-bold">
                          <th className="pb-4">Mã đơn</th>
                          <th className="pb-4">Ngày đặt</th>
                          <th className="pb-4">Tổng tiền</th>
                          <th className="pb-4">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        {orders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-50">
                            <td className="py-4 font-bold text-[#e06c7f]">{order.id}</td>
                            <td className="py-4">{order.date}</td>
                            <td className="py-4 font-semibold">{order.total}</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Đang giao' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;