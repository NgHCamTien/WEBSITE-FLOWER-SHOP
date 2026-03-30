import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaChevronLeft } from 'react-icons/fa';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:5000';
  const shippingFee = 30000;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingFee;

  // --- HÀM LẤY ẢNH ĐỒNG BỘ ---
  const getImageUrl = (imgName) => {
    if (!imgName) return "/DDT.png"; 
    if (imgName.startsWith('http')) return imgName;
    const cleanName = imgName.replace('uploads/', '').replace(/\\/g, '/');
    return `${API_URL}/uploads/${cleanName}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-40 text-center bg-[#FFFDFD]">
        <div className="mb-6 text-6xl animate-bounce">🥀</div>
        <h2 className="text-xl font-serif font-bold text-[#4b2c2b] mb-6">Giỏ hàng của Tiên đang trống...</h2>
        <Link to="/product" className="inline-flex items-center gap-2 bg-[#e06c7f] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:scale-105 transition-all">
          <FaChevronLeft size={12}/> QUAY LẠI MUA HOA
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDFD] min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.3em]">Your Selection</span>
          <h1 className="text-4xl font-serif font-bold text-[#4b2c2b] mt-2">Giỏ Hàng 🌸</h1>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(255,182,193,0.15)] border border-pink-50 relative overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-pink-50 text-[10px] font-bold uppercase tracking-widest text-pink-300 px-4">
            <div className="col-span-5 text-left">Mẫu hoa</div>
            <div className="col-span-2 text-center">Đơn giá</div>
            <div className="col-span-3 text-center">Số lượng</div>
            <div className="col-span-2 text-right">Thành tiền</div>
          </div>

          <div className="divide-y divide-pink-50">
            {cartItems.map((item) => (
              <div key={item._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 items-center px-4 relative group transition-all">
                <div className="col-span-5 flex items-center gap-6">
                  <div className="w-24 h-24 bg-pink-50 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-inner">
                    {/* SỬA ẢNH Ở ĐÂY */}
                    <img 
                      src={getImageUrl(item.image || item.thumbnail?.[0])} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => (e.currentTarget.src = '/DDT.png')}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-serif font-bold text-[#4b2c2b] leading-tight group-hover:text-[#e06c7f] transition-colors">
                        {item.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">DDT Flower Design</p>
                  </div>
                </div>

                <div className="col-span-2 text-center text-sm font-bold text-[#4b2c2b]/70">
                  {item.price?.toLocaleString()}₫
                </div>

                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center bg-pink-50/50 rounded-2xl p-1 border border-pink-100">
                    <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center text-[#4b2c2b] hover:text-[#e06c7f] transition-colors"><FaMinus size={10}/></button>
                    <span className="w-8 text-center font-bold text-xs text-[#4b2c2b]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#4b2c2b] hover:text-[#e06c7f] transition-colors"><FaPlus size={10}/></button>
                  </div>
                </div>

                <div className="col-span-2 text-right text-base font-black text-[#e06c7f] tracking-tighter">
                  {(item.price * item.quantity).toLocaleString()}₫
                </div>

                <button onClick={() => removeFromCart(item._id)} className="absolute top-4 right-0 md:-right-2 text-gray-200 hover:text-red-400 transition-colors p-2">
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-50/50 blur-3xl rounded-full" />
        </div>

        <div className="mt-12 bg-white rounded-[3rem] p-10 shadow-[0_20px_40px_rgba(255,182,193,0.2)] border border-pink-50 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
            <div className="flex-1 text-center md:text-left space-y-2">
              <h4 className="font-serif text-lg font-bold text-[#4b2c2b]">Thông tin thanh toán 🌸</h4>
              <p className="text-gray-400 text-[11px] italic max-w-xs">
                "Cảm ơn Tiên vì đã để DDT Flower đồng hành cùng món quà ý nghĩa của bạn."
              </p>
            </div>

            <div className="flex flex-col gap-2 min-w-[220px]">
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Tạm tính:</span>
                <span className="text-[#4b2c2b]">{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Phí ship:</span>
                <span className="text-[#4b2c2b]">{shippingFee.toLocaleString()}₫</span>
              </div>
              <div className="h-[1px] border-t border-dashed border-pink-100 my-2"></div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-[#4b2c2b] uppercase tracking-tighter mr-6">Tổng cộng:</span>
                <span className="text-3xl font-black text-[#e06c7f] tracking-tighter leading-none">
                  {total.toLocaleString()}₫
                </span>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full md:w-[280px] bg-[#4b2c2b] text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-gray-200 hover:bg-[#e06c7f] hover:shadow-pink-200 transition-all duration-500 uppercase text-[11px] tracking-[0.3em] active:scale-95 flex items-center justify-center gap-3"
              >
                Tiến hành đặt hàng <FaPlus size={12}/>
              </button>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-pink-100/20 blur-3xl rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CartPage;