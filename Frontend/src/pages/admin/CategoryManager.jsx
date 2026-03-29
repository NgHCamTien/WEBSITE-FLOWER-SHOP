import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' }); // Thêm description
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/categories';

  // Hàm tạo Slug tự động từ Tên
  const createSlug = (text) => {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Khử dấu tiếng Việt
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error("Lỗi lấy danh mục");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      slug: createSlug(formData.name), // Tự tạo slug từ tên
      description: formData.description
    };

    try {
      if (editCat) {
        await axios.put(`${API_URL}/${editCat._id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      alert("Thao tác thành công rồi nhé Tiên! 🌸");
      handleCloseModal();
      fetchCategories();
    } catch (err) {
      alert("Lỗi rồi Tiên ơi, kiểm tra xem tên hoặc slug có bị trùng không nhé!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa danh mục này có thể ảnh hưởng đến sản phẩm, Tiên chắc chưa?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCat(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10 px-2">
        <h1 className="text-2xl font-bold text-[#881337] uppercase tracking-widest">Quản lý danh mục</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#881337] text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg shadow-rose-200 hover:bg-[#6b0f2a] transition-all transform hover:scale-105 active:scale-95"
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="bg-[#FEF2F4]/50 rounded-[2rem] p-4 border border-pink-100 shadow-inner overflow-hidden">
        <div className="grid grid-cols-4 p-5 text-xs font-bold uppercase tracking-widest text-[#881337]/70 text-center border-b border-pink-100">
          <span>STT</span>
          <span className="text-left ml-4">Danh mục & Slug</span>
          <span>Mô tả</span>
          <span>Thao tác</span>
        </div>

        <div className="divide-y divide-pink-50">
          {categories.map((cat, index) => (
            <div key={cat._id} className="grid grid-cols-4 p-6 items-center text-center hover:bg-white rounded-2xl transition-all group">
              <span className="text-gray-400 font-bold text-sm">0{index + 1}</span>
              <div className="text-left ml-4">
                <div className="font-bold text-gray-800 text-sm">{cat.name}</div>
                <div className="text-[10px] text-pink-400 font-mono italic">slug: {cat.slug}</div>
              </div>
              <span className="text-xs text-gray-500 line-clamp-1 italic">{cat.description || 'Không có mô tả'}</span>
              <div className="flex justify-center gap-6 text-[11px] font-bold uppercase tracking-wider">
                <button 
                  onClick={() => { setEditCat(cat); setFormData({ name: cat.name, description: cat.description || '' }); setShowModal(true); }}
                  className="text-gray-400 hover:text-[#881337] transition-colors underline underline-offset-4">Sửa</button>
                <button 
                  onClick={() => handleDelete(cat._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors underline underline-offset-4">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CẬP NHẬT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[300] p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md border-4 border-[#FEF2F4]">
            <h2 className="text-[#881337] font-bold mb-6 uppercase text-center">{editCat ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Tên danh mục</label>
                <input 
                  autoFocus required
                  className="w-full p-3 bg-pink-50 rounded-xl outline-none border border-pink-100 font-medium focus:border-pink-300"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ví dụ: Hoa sinh nhật"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Mô tả danh mục</label>
                <textarea 
                  rows="3"
                  className="w-full p-3 bg-pink-50 rounded-xl outline-none border border-pink-100 font-medium resize-none focus:border-pink-300 text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Nhập mô tả ngắn cho danh mục..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 text-gray-400 font-bold text-xs uppercase hover:bg-gray-50 rounded-xl transition-colors">Hủy</button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-3 bg-[#881337] text-white rounded-xl font-bold text-xs uppercase shadow-md hover:bg-black transition-all"
                >
                  {loading ? "Đang lưu..." : "Lưu dữ liệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;