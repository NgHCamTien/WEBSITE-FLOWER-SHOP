import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaBox, FaMapMarkerAlt, FaPhoneAlt, FaRegClock } from 'react-icons/fa';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const foundOrder = res.data.find(o => o._id === id);
        setOrder(foundOrder);
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  const getImageUrl = (item) => {
    const rawPath = item?.productId?.image || item?.image || "";
    if (rawPath.startsWith('http')) return rawPath;
    const cleanPath = rawPath.replace(/\\/g, '/').replace('uploads/', '');
    return `${API_URL}/uploads/${cleanPath}`;
  };

  if (loading) return <div className="text-center p-20 font-bold text-gray-400">Đang tải đơn hàng...</div>;
  if (!order) return <div className="text-center p-20 text-gray-400">Không tìm thấy đơn hàng!</div>;

  return (
    // NỀN NGOÀI CÙNG LÀ TRẮNG TINH
    <div className="flex flex-col min-h-screen bg-white text-[#2c2c2c] font-sans antialiased">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 pt-10">
        {/* Nút quay lại đơn giản */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-[#e06c7f] font-bold text-xs mb-8 transition-all"
        >
          <FaChevronLeft size={12}/> TRỞ VỀ DANH SÁCH
        </button>

        {/* KHUNG NÀY SẼ LÀ MÀU BE NHẠT (#f9f5f1) */}
        <div className="bg-[#f9f5f1] rounded-[3rem] shadow-sm border border-[#ece0d1] overflow-hidden mb-20">
          
          {/* Header Đơn hàng - Màu đen xám đậm */}
          <div className="bg-[#2c2c2c] p-10 md:p-12 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Chi tiết đơn hàng</h1>
                <p className="text-xs text-gray-400 mt-2">Mã đơn: #{order._id.toUpperCase()}</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1">Trạng thái</p>
                <p className="text-sm font-bold uppercase text-[#e06c7f]">{order.status || 'Chờ xác nhận'}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-14 space-y-12">
            
            {/* 1. Danh sách sản phẩm */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#2c2c2c]/30 border-b border-[#2c2c2c]/10 pb-4">
                Sản phẩm của bạn
              </h4>

              <div className="divide-y divide-[#2c2c2c]/5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 py-8 first:pt-0">
                    <div className="w-20 h-24 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-[#2c2c2c]/5 shadow-sm">
                      <img src={getImageUrl(item)} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-base font-bold text-[#2c2c2c]">{item.name}</h5>
                      <p className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="text-xl font-bold text-[#e06c7f]">
                      {(item.price * item.quantity).toLocaleString()}₫
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Thông tin giao hàng - Các box nhỏ màu trắng để nổi bật trên nền be */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#2c2c2c]/30 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#e06c7f]"/> ĐỊA CHỈ GIAO HOA
                </h4>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#2c2c2c]/5">
                  <p className="text-[13px] text-[#2c2c2c]/80 leading-relaxed font-medium">{order.address}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#2c2c2c]/30 flex items-center gap-2">
                  <FaPhoneAlt className="text-[#e06c7f]"/> THÔNG TIN LIÊN LẠC
                </h4>
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#2c2c2c]/5 space-y-4">
                  <p className="text-lg text-[#2c2c2c] font-bold tracking-tight">{order.phone}</p>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400 font-bold border-t pt-4">
                    <FaRegClock/> 
                    <span>Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Tổng cộng */}
            <div className="pt-10 flex justify-between items-end border-t border-[#2c2c2c]/5">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phương thức thanh toán</p>
                  <p className="text-xs font-bold text-[#2c2c2c] uppercase">{order.paymentMethod || 'Tiền mặt'}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tổng thanh toán</p>
                  <p className="text-4xl font-bold text-[#e06c7f] tracking-tighter">
                    {order.totalAmount?.toLocaleString()}₫
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetail;