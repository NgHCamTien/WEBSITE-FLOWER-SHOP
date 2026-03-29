import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';

const AddressSection = ({ address, onEdit, onPhoneChange, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', city: '', detail: ''
  });

  const handleComplete = async () => {
    // Gom thông tin lại thành 1 chuỗi địa chỉ
    const fullAddress = `${formData.detail}, ${formData.city}`;
    
    if (!formData.fullName || !formData.phone || !formData.detail || !formData.city) {
      return alert("Tiên điền đủ thông tin nhé! 🌸");
    }

    try {
      // 1. Lưu vào Database
      await axios.post(`http://localhost:5000/api/users/address`, {
        userId,
        ...formData,
        fullAddress
      });

      // 2. Gửi dữ liệu ngược lại cho trang Checkout
      onEdit(fullAddress);
      onPhoneChange(formData.phone);
      
      // 3. Đóng Modal và xóa dữ liệu tạm trong form
      setIsModalOpen(false);
      setFormData({ fullName: '', phone: '', city: '', detail: '' });
      alert("Đã cập nhật địa chỉ! ✨");
    } catch (err) {
      alert("Lỗi rồi Tiên ơi, kiểm tra server nhé!");
    }
  };

  return (
    <div className="relative">
      {/* KHỐI HIỂN THỊ TRÊN TRANG THANH TOÁN */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-black/[0.03] text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <span className="bg-[#4b2c2b] text-white text-[9px] px-4 py-1.5 rounded-full uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                <FaMapMarkerAlt size={10}/> Địa chỉ giao hoa
              </span>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[#e06c7f] text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 decoration-dashed"
              >
                thay đổi
              </button>
            </div>
            <p className="text-[#1A0505] font-sans text-lg font-bold">
              {address ? address : "Tiên chưa chọn địa chỉ nhận hoa... 🥀"}
            </p>
          </div>
        </div>
      </div>

      {/* MODAL NHẬP ĐỊA CHỈ - HIỆN THẲNG FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative bg-[#D9C5C5] w-full max-w-md shadow-2xl p-1 animate-in zoom-in duration-300">
            <div className="bg-white p-8 flex flex-col">
              
              <div className="flex justify-between items-center border-b border-black/10 pb-4 mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">Nhập địa chỉ mới</h3>
                <button onClick={() => setIsModalOpen(false)}><FaTimes/></button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Họ tên"
                    className="w-full bg-[#FAF9F9] p-4 text-xs outline-none border border-black/5"
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Số điện thoại"
                    className="w-full bg-[#FAF9F9] p-4 text-xs outline-none border border-black/5"
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <input 
                  type="text" placeholder="Tỉnh/Thành phố, Quận/Huyện"
                  className="w-full bg-[#FAF9F9] p-4 text-xs outline-none border border-black/5"
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <textarea 
                  placeholder="Địa chỉ cụ thể (Số nhà, tên đường...)"
                  className="w-full bg-[#FAF9F9] p-4 text-xs outline-none border border-black/5 min-h-[100px] resize-none"
                  onChange={(e) => setFormData({...formData, detail: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-gray-400 px-6 py-3 text-[9px] uppercase font-bold"
                >Hủy</button>
                <button 
                  onClick={handleComplete} 
                  className="bg-[#e06c7f] text-white px-8 py-4 text-[9px] uppercase font-bold shadow-lg"
                >Hoàn chỉnh & Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSection;