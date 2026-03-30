import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tracking'); // 'tracking' hoặc 'history'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getImageUrl = (item) => {
    const rawPath = item?.productId?.image || item?.image || "";
    if (rawPath.startsWith('http')) return rawPath;
    const cleanPath = rawPath.replace(/\\/g, '/').replace('uploads/', '');
    return `http://localhost:5000/uploads/${cleanPath}`;
  };

  // Logic lọc đơn hàng theo Tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'tracking') {
      // Đơn hàng đang xử lý (Chờ xác nhận, Đang giao...)
      return order.status !== 'Đã hoàn thành' && order.status !== 'Đã hủy';
    } else {
      // Đơn hàng đã xong hoặc đã hủy
      return order.status === 'Đã hoàn thành' || order.status === 'Đã hủy';
    }
  });

  if (loading) return <div className="text-center p-20 italic text-pink-400 font-bold">Đang tìm đơn hàng cho Tiên... 🌸</div>;

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#2c2c2c] font-sans antialiased">


      <main className="flex-1 max-w-4xl w-full mx-auto p-6 py-12">
        {/* TIÊU ĐỀ TRANG */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[#2c2c2c] uppercase">
            Quản lý đơn hàng
          </h1>
          <div className="w-16 h-1 bg-[#e06c7f] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* --- THANH TAB LỊCH SỬ --- */}
        <div className="flex justify-center mb-12 gap-8 border-b border-[#ece0d1]">
          <button 
            onClick={() => setActiveTab('tracking')}
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'tracking' ? 'text-[#e06c7f]' : 'text-gray-400 hover:text-[#2c2c2c]'
            }`}
          >
            Đang theo dõi
            {activeTab === 'tracking' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e06c7f] rounded-full animate-in fade-in duration-300"></div>}
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'history' ? 'text-[#e06c7f]' : 'text-gray-400 hover:text-[#2c2c2c]'
            }`}
          >
            Lịch sử đơn hàng
            {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e06c7f] rounded-full animate-in fade-in duration-300"></div>}
          </button>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-[#f9f5f1] rounded-[3rem] border border-[#ece0d1]">
            <p className="text-gray-400 text-sm font-medium italic">
              {activeTab === 'tracking' ? "Tiên chưa có đơn hàng nào đang giao hết nè! 🌸" : "Lịch sử của Tiên còn trống nè! ✨"}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredOrders.map((order) => {
              const firstItem = order.items[0];
              return (
                <div key={order._id} className="bg-[#f9f5f1] rounded-[3rem] p-8 flex flex-col md:flex-row items-center border border-[#ece0d1] shadow-sm hover:shadow-md transition-all duration-500 group">
                  
                  <div className="w-32 h-40 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#2c2c2c]/5 flex-shrink-0">
                    <img 
                      src={getImageUrl(firstItem)} 
                      alt="flower" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  <div className="flex-grow md:ml-10 mt-6 md:mt-0 text-center md:text-left space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <h3 className="font-bold text-xl text-[#2c2c2c] tracking-tight uppercase">#{order._id.slice(-7).toUpperCase()}</h3>
                      <span className="text-[10px] bg-white px-4 py-1.5 rounded-full text-[#e06c7f] font-bold tracking-widest uppercase border border-[#ece0d1]">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 font-medium">
                      Mẫu hoa: <span className="text-[#2c2c2c] font-bold">{firstItem?.name} {order.items.length > 1 && `và ${order.items.length - 1} món khác`}</span>
                    </p>
                    <p className="text-sm text-gray-500 font-medium">
                      Thành tiền: <span className="font-bold text-[#e06c7f] text-xl tracking-tight">{order.totalAmount?.toLocaleString()}₫</span>
                    </p>
                  </div>

                  <div className="md:text-right flex flex-col justify-between h-32 mt-6 md:mt-0 w-full md:w-auto">
                    <div className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-sm text-center border
                      ${order.status === 'Đã hoàn thành' ? 'bg-green-50 text-green-600 border-green-100' : 
                        order.status === 'Đã hủy' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#2c2c2c] text-white'}`}>
                      {order.status || 'Chờ xác nhận'}
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/order-detail/${order._id}`)}
                      className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#e06c7f] transition-all underline underline-offset-8 decoration-[#ece0d1] hover:decoration-[#e06c7f]"
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

   
    </div>
  );
};

export default OrderTracking;