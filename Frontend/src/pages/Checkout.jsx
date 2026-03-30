import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import AddressSection from '../components/user/AddressSection';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Khởi tạo các State mới cho màn hình thành công
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderInfo, setOrderInfo] = useState({
    phone: '',
    address: 'Vui lòng chọn hoặc thêm địa chỉ giao hoa...',
    paymentMethod: 'Tiền mặt'
  });

  useEffect(() => {
    if (user) {
      setOrderInfo(prev => ({
        ...prev,
        phone: user.phone || prev.phone,
        address: user.addresses?.[0]?.fullAddress || prev.address
      }));
    }
  }, [user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handleEditAddress = (newAddress) => {
    setOrderInfo(prev => ({ ...prev, address: newAddress }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Chặn double click

    if (cartItems.length === 0) return alert("Giỏ hàng trống rồi Tiên ơi! 🌸");
    if (!orderInfo.phone || orderInfo.address.includes('Vui lòng')) {
      return alert("Tiên ơi, nhớ kiểm tra lại SĐT và Địa chỉ giao hoa nhé!");
    }

    setIsSubmitting(true);

    // Tìm đến dòng 58 trong file Checkout.jsx
const orderData = {
  userId: user?._id || null, // Lưu ý: Chỗ này bạn đang viết _hid, nên sửa thành _id cho chuẩn MongoDB
  items: cartItems.map(item => ({
    productId: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    // THÊM DÒNG NÀY ĐỂ HIỆN ĐƯỢC ẢNH Ở TRANG THEO DÕI
    image: item.thumbnail?.[0] || item.image 
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
        // Lấy ID đơn hàng từ server trả về
        setOrderId(res.data.order?._id || 'DTP1120'); 
        setIsSuccess(true); // Hiển thị màn hình thành công
        clearCart();
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối Server rồi, Tiên kiểm tra lại terminal nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- GIAO DIỆN XÁC NHẬN ĐƠN HÀNG (FIGMA) ---
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF9F9] flex items-center justify-center px-4 font-sans animate-in fade-in duration-700">
        <div className="max-w-xl w-full bg-white rounded-[3rem] p-10 md:p-16 shadow-sm border border-black/[0.03] text-center space-y-10">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-[#1A0505]">
              Cảm ơn bạn đã đặt hàng !!
            </h2>
            <p className="text-[11px] text-gray-500 leading-relaxed px-4 md:px-10 font-medium">
              Đơn hàng của bạn đã được xác nhận và đang được xử lý. <br/>
              Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn.
            </p>
          </div>

          <div className="bg-[#EAE2E2] py-6 px-10 rounded-2xl inline-block mx-auto">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Mã đơn hàng</p>
            <p className="text-sm font-bold tracking-widest text-[#1A0505]">#{orderId.slice(-7).toUpperCase()}</p>
          </div>

          <p className="text-[10px] text-gray-400 italic px-6">
            Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao. Bạn có thể kiểm tra trạng thái đơn hàng trong trang tài khoản của mình.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 bg-[#8E8E8E] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-600 transition-all active:scale-95"
            >
              Tiếp tục mua sắm
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className="flex-1 bg-[#1A0505] text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:shadow-xl transition-all active:scale-95"
            >
              Xem đơn hàng của tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- GIAO DIỆN THANH TOÁN GỐC ---
  return (
    <div className="bg-[#FAF9F9] min-h-screen py-16 px-4 font-sans text-[#2D2D2D]">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="border-b border-black/5 pb-8">
          <h1 className="text-2xl font-bold uppercase tracking-[0.15em] text-center text-[#1A0505]">
            Thanh toán
          </h1>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest text-center mt-2 font-bold">
            DDT Flower Shop - Bloom with love
          </p>
        </div>

        {/* 1. ĐỊA CHỈ */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-black/[0.03]">
          <AddressSection 
            address={orderInfo.address}
            onEdit={handleEditAddress}
            onPhoneChange={(val) => setOrderInfo(prev => ({ ...prev, phone: val }))}
            userId={user?._id} 
          />
        </div>

        {/* 2. ĐƠN HÀNG */}
        <div className="space-y-6">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 pl-2">Giỏ hàng của bạn</h2>
          <div className="bg-white rounded-[2rem] border border-black/[0.03] overflow-hidden shadow-sm">
            <div className="divide-y divide-black/[0.03]">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-6 p-6">
                  <div className="w-16 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={item.thumbnail?.[0]?.startsWith('http') ? item.thumbnail[0] : `http://localhost:5000${item.thumbnail?.[0] || item.image}`} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider">{item.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold tracking-tighter text-[#e06c7f]">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. PHƯƠNG THỨC THANH TOÁN & VIETQR */}
        <div className="bg-[#EAE2E2] rounded-[2.5rem] p-10 space-y-8 shadow-inner">
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

          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-8 border border-white/50 mx-auto max-w-md">
            {orderInfo.paymentMethod === 'Chuyển khoản' && (
              <div className="animate-in slide-in-from-bottom-2 fade-in duration-500 space-y-6 mb-8 text-center">
                <p className="text-[9px] font-bold text-pink-400 uppercase tracking-[0.3em]">Thanh toán qua VietQR</p>
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-pink-50 inline-block">
                   <img 
                     src={`https://img.vietqr.io/image/ACB-30933977-compact2.png?amount=${total}&addInfo=DDT_SHOP_${user?.name || 'KHACH'}&accountName=DDT_SHOP`} 
                     alt="VietQR" 
                     className="w-44 h-44 object-contain"
                   />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold tracking-widest text-gray-700">STK: 30933977</p>
                   <p className="text-[9px] text-gray-400 uppercase font-bold">ACB - DDT FLOWER SHOP</p>
                </div>
                <div className="h-[1px] border-t border-dashed border-black/10 w-full" />
              </div>
            )}

            <div className="space-y-4 px-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <span>Tạm tính</span>
                <span className="text-black">{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                <span>Phí vận chuyển</span>
                <span className="text-black">{shippingFee.toLocaleString()}₫</span>
              </div>
              <div className="pt-6 border-t border-black/10 flex justify-between items-end font-bold">
                <span className="text-[10px] uppercase tracking-[0.3em]">Tổng tiền</span>
                <span className="text-2xl tracking-tighter text-[#1A0505]">
                  {total.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button 
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className={`bg-[#1A0505] text-white px-20 py-5 rounded-2xl font-bold tracking-[0.5em] uppercase shadow-2xl transition-all duration-500 text-[10px] active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
            >
              {isSubmitting ? 'ĐANG XỬ LÝ...' : 'THANH TOÁN'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;