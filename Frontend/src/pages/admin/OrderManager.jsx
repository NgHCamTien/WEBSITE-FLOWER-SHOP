import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Để hiện Modal chi tiết
  const API_URL = 'http://localhost:5000/api/orders';

  // 1. Lấy danh sách đơn hàng từ server
  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error("Lỗi lấy đơn hàng:", err);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // 2. Cập nhật trạng thái đơn hàng (Ví dụ: Từ Chờ xử lý -> Đang giao)
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: newStatus });
      fetchOrders();
      if (selectedOrder) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Không cập nhật được trạng thái!");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-[#881337] mb-10 uppercase tracking-widest px-2">
        Đơn đặt hàng 🧾
      </h1>

      <div className="bg-[#FEF2F4]/50 rounded-[2.5rem] p-4 border border-pink-100 shadow-inner">
        {/* Table Header */}
        <div className="grid grid-cols-5 p-5 text-xs font-bold uppercase tracking-widest text-[#881337]/70 text-center border-b border-pink-100">
          <span>Mã đơn</span>
          <span>Khách hàng</span>
          <span>Ngày đặt</span>
          <span>Tổng tiền</span>
          <span>Trạng thái</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-pink-50">
          {orders.map((order) => (
            <div 
              key={order._id} 
              onClick={() => setSelectedOrder(order)} // Bấm vào hàng để xem chi tiết
              className="grid grid-cols-5 p-6 items-center text-center hover:bg-white rounded-2xl transition-all group cursor-pointer"
            >
              <span className="font-bold text-[#881337] text-sm tracking-tight">#{order._id.slice(-6).toUpperCase()}</span>
              <span className="text-gray-700 text-sm font-medium">{order.userId?.name || 'Khách lẻ'}</span>
              <span className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
              <span className="font-bold text-gray-800 text-sm">{order.totalAmount?.toLocaleString()}đ</span>
              <div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                  order.status === 'Chờ xác nhận' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                  order.status === 'Đang giao' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                  order.status === 'Đã hoàn thành' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL CHI TIẾT ĐƠN HÀNG --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[300] p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl relative border-4 border-[#FEF2F4] overflow-hidden">
            
            <button 
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-8 text-gray-300 hover:text-[#881337] text-3xl transition-colors"
            >×</button>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#881337] italic">Chi Tiết Đơn Hàng 🌸</h2>
              <p className="text-gray-400 text-[10px] font-mono tracking-widest mt-1">ID: {selectedOrder._id}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100">
                <h3 className="text-[10px] font-bold text-[#881337] uppercase tracking-widest mb-3 opacity-60">Người nhận</h3>
                <p className="font-bold text-gray-800">{selectedOrder.userId?.name || 'Khách chưa đăng ký'}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedOrder.phone || 'Chưa có SĐT'}</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{selectedOrder.address || 'Nhận tại cửa hàng'}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Xử lý đơn</h3>
                <select 
                  className="w-full p-2 bg-white rounded-xl border border-gray-200 text-xs font-bold outline-none focus:border-[#881337]"
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                >
                  <option value="Chờ xác nhận">Chờ xác nhận</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã hoàn thành">Đã hoàn thành</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
                <p className="mt-4 text-[9px] text-gray-400 italic font-medium">Lưu ý: Thay đổi trạng thái sẽ gửi thông báo đến khách hàng.</p>
              </div>
            </div>

            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Danh sách hoa đã đặt</h3>
              {selectedOrder.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700">{item.name}</span>
                    <span className="text-[10px] text-gray-400 italic">Số lượng: {item.quantity}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">{(item.price * item.quantity).toLocaleString()}₫</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t-2 border-dashed border-pink-100 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tổng thanh toán</span>
              <span className="text-3xl font-black text-[#881337] tracking-tighter">{selectedOrder.totalAmount?.toLocaleString()}₫</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;