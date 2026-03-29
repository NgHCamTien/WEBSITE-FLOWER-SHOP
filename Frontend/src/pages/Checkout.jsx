import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import AddressSection from '../components/user/AddressSection';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

const [orderInfo, setOrderInfo] = useState({
  phone: user?.phone || '', // Nếu user có sđt thì tự lấy luôn
  address: user?.address || 'Chưa có địa chỉ...',
  paymentMethod: 'Tiền mặt'
});

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

 const handleEditAddress = (newAddress) => {
  if (newAddress) {
    setOrderInfo(prev => ({ ...prev, address: newAddress }));
  }
};

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Giỏ hàng trống!");
    if (!orderInfo.phone) return alert("Vui lòng nhập số điện thoại!");

    const orderData = {
      userId: user?._id || null,
      items: cartItems.map(item => ({
        productId: item._id, name: item.name, price: item.price, quantity: item.quantity
      })),
      totalAmount: total,
      address: orderInfo.address,
      phone: orderInfo.phone,
      paymentMethod: orderInfo.paymentMethod,
      status: 'Chờ xác nhận'
    };

    try {
      const res = await axios.post('http://localhost:5000/api/orders', orderData);
      if (res.data.success) {
        alert("Đã đặt hoa thành công! 🌸");
        clearCart();
        navigate('/');
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="bg-[#FAF9F9] min-h-screen py-16 px-4 font-sans text-[#2D2D2D]">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* HEADER - Tối giản tuyệt đối */}
     <div className="border-b border-black/5 pb-8">
  <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-center text-[#1A0505]">
    Thanh toán
  </h1>
  <p className="text-[9px] text-gray-400 uppercase tracking-widest text-center mt-2">
    Vui lòng kiểm tra lại thông tin đơn hàng
  </p>
</div>

        {/* 1. ĐỊA CHỈ - Tận dụng Component của Tiên */}
    {/* 1. ĐỊA CHỈ - Đảm bảo truyền đủ props để không bị trắng xóa */}
<div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-black/[0.03]">
<AddressSection 
  address={orderInfo.address}
  onEdit={handleEditAddress}
  onPhoneChange={(val) => setOrderInfo(prev => ({ ...prev, phone: val }))}
  // Lấy ID tự động từ Context/Dữ liệu đăng nhập, không gõ tay ID nữa
  userId={user?._id} 
/>
</div>

        {/* 2. ĐƠN HÀNG - Dạng bảng phẳng (Flat Design) */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pl-2">Chi tiết đơn hàng</h2>
          <div className="bg-white rounded-[2rem] border border-black/[0.03] overflow-hidden shadow-sm">
            <div className="divide-y divide-black/[0.03]">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-6 p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="w-16 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider">{item.name}</h3>
                    <p className="text-[10px] text-gray-400">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium tracking-tighter">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. THANH TOÁN - Khối màu Hồng Tro (Nude) thanh lịch */}
        <div className="bg-[#EAE2E2] rounded-[2.5rem] p-10 space-y-8 shadow-inner">
          
          {/* Tabs Phương thức */}
          <div className="flex justify-center gap-2 bg-black/5 p-1.5 rounded-2xl w-fit mx-auto">
            {['Tiền mặt', 'Chuyển khoản'].map(method => (
              <button 
                key={method}
                type="button"
                onClick={() => setOrderInfo({...orderInfo, paymentMethod: method})}
                className={`px-8 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  orderInfo.paymentMethod === method 
                  ? 'bg-white text-black shadow-md' 
                  : 'text-black/30 hover:text-black/60'
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          {/* Nội dung QR hoặc Tổng tiền */}
          <div className={`bg-white/80 backdrop-blur-md rounded-[2rem] p-8 border border-white/50 transition-all duration-700 mx-auto max-w-md`}>
            
            {orderInfo.paymentMethod === 'Chuyển khoản' && (
              <div className="animate-in slide-in-from-bottom-2 fade-in duration-500 space-y-6 mb-8 text-center">
                <p className="text-[9px] font-bold text-pink-400 uppercase tracking-[0.3em]">VietQR Transfer</p>
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-pink-50 inline-block">
                   <img 
                     src={`https://img.vietqr.io/image/ACB-30933977-compact2.png?amount=${total}&addInfo=DDT SHOP&accountName=DDT SHOP`} 
                     alt="VietQR" 
                     className="w-44 h-44 object-contain"
                   />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold tracking-widest">30933977</p>
                   <p className="text-[9px] text-gray-400 uppercase">Ngân hàng ACB - DDT SHOP</p>
                </div>
                <div className="h-[1px] border-t border-dashed border-black/10 w-full" />
              </div>
            )}

            <div className="space-y-4 px-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400">
                <span>Tạm tính</span>
                <span className="text-black">{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400">
                <span>Vận chuyển</span>
                <span className="text-black">{shippingFee.toLocaleString()}₫</span>
              </div>
              <div className="pt-6 border-t border-black/10 flex justify-between items-end font-bold">
                <span className="text-[10px] uppercase tracking-[0.3em]">Tổng thanh toán</span>
                <span className="text-2xl tracking-tighter text-[#1A0505]">
                  {total.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>

          {/* Nút chốt đơn - Đen tuyền thanh lịch */}
          <div className="flex justify-center pt-4">
            <button 
              onClick={handleSubmitOrder}
              className="bg-[#1A0505] text-white px-20 py-5 rounded-2xl font-bold tracking-[0.5em] uppercase shadow-2xl hover:opacity-90 transition-all duration-500 text-[10px] active:scale-95"
            >
              Đặt hoa ngay
            </button>
          </div>
        </div>

        <div className="text-center">
           <p className="text-[9px] text-gray-300 uppercase tracking-widest italic">DDT Flower Shop © 2026 - Bloom with love</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;