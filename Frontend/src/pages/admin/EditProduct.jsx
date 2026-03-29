import React, { useState } from 'react';
import axios from 'axios';

const EditProduct = ({ product, onClose, onRefresh }) => {
  // Khởi tạo state với dữ liệu hiện tại của sản phẩm
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    category: product.category || 'Hoa bó',
    description: product.description || ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gửi yêu cầu cập nhật lên Server
      await axios.put(`http://localhost:5000/api/products/${product._id}`, formData);
      alert("Cập nhật hoa thành công! ✨");
      onRefresh(); // Load lại danh sách ở trang Manager
      onClose();   // Đóng modal
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật rồi Tiên ơi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]">
      <div className="bg-[#FEF2F4] p-8 rounded-2xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#881337] mb-6 text-center uppercase tracking-widest">Sửa Thông Tin Hoa 🌸</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* 1. Tên sản phẩm */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Tên sản phẩm</label>
            <input name="name" type="text" value={formData.name} required 
                   className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none focus:border-[#881337]" 
                   onChange={handleInputChange} />
          </div>

          {/* 2. Số lượng và Giá chung 1 hàng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Số lượng (Tồn)</label>
              <input name="stock" type="number" value={formData.stock} required
                     className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none" 
                     onChange={handleInputChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Giá bán (VNĐ)</label>
              <input name="price" type="number" value={formData.price} required 
                     className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none" 
                     onChange={handleInputChange} />
            </div>
          </div>

          {/* 3. Danh mục 1 hàng riêng */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Danh mục sản phẩm</label>
            <select name="category" 
                    className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none"
                    onChange={handleInputChange} value={formData.category}>
              <option value="Hoa bó">Hoa bó</option>
              <option value="Hoa giỏ">Hoa giỏ</option>
              <option value="Hoa kệ">Hoa kệ</option>
              <option value="Lan hồ điệp">Lan hồ điệp</option>
            </select>
          </div>

          {/* 4. Mô tả */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Mô tả chi tiết</label>
            <textarea name="description" rows="3" value={formData.description}
                      className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none resize-none"
                      onChange={handleInputChange}></textarea>
          </div>

          {/* Nút điều hướng */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} 
                    className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl font-bold uppercase text-xs hover:bg-gray-300">
              Hủy
            </button>
            <button type="submit" disabled={loading} 
                    className={`flex-1 ${loading ? 'bg-gray-400' : 'bg-[#881337]'} text-white py-3 rounded-xl font-bold uppercase text-xs shadow-md hover:scale-[1.02] transition-transform`}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;