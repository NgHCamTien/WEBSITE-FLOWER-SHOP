import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '', 
    price: '', 
    stock: 0, 
    category: '', // Để trống ban đầu để lấy cái đầu tiên từ DB
    description: ''
  });
  const [categories, setCategories] = useState([]); // State lưu danh sách danh mục từ DB
  const [files, setFiles] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  // --- 1. LẤY DANH MỤC THẬT TỪ DATABASE ---
  useEffect(() => {
    if (isOpen) {
      axios.get('http://localhost:5000/api/categories')
        .then(res => {
          if (res.data.success) {
            setCategories(res.data.categories);
            // Nếu có danh mục, mặc định chọn cái đầu tiên
            if (res.data.categories.length > 0) {
              setFormData(prev => ({ ...prev, category: res.data.categories[0].name }));
            }
          }
        })
        .catch(err => console.error("Không lấy được danh mục:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectFile = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);

      const newPreviews = [...previews];
      if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]);
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Tiên điền thiếu thông tin rồi!");

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    data.append('category', formData.category);
    data.append('description', formData.description);

    files.forEach(file => { 
      if (file) data.append('thumbnail', file); 
    });

    try {
      await axios.post('http://localhost:5000/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("Thêm hoa thành công! 🌸");
      onRefresh(); 
      handleClose();
    } catch (err) {
      alert("Lỗi server, Tiên kiểm tra lại nhé!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    previews.forEach(url => url && URL.revokeObjectURL(url));
    setFiles([null, null, null, null]);
    setPreviews([null, null, null, null]);
    setFormData({ name: '', price: '', stock: 0, category: '', description: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]">
      <div className="bg-[#FEF2F4] p-8 rounded-2xl max-w-lg w-full shadow-2xl max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-[#881337] mb-6 text-center uppercase tracking-widest">Nhập Hoa Mới 🌸</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* 1. Tên sản phẩm */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Tên sản phẩm</label>
            <input name="name" type="text" placeholder="Nhập tên loại hoa..." required 
                   className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none focus:border-[#881337]" 
                   onChange={handleInputChange} />
          </div>

          {/* 2. Số lượng và Giá */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Số lượng (Tồn)</label>
              <input name="stock" type="number" placeholder="0" required
                     className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none" 
                     onChange={handleInputChange} />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">Giá bán (VNĐ)</label>
              <input name="price" type="number" placeholder="0" required 
                     className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none" 
                     onChange={handleInputChange} />
            </div>
          </div>

          {/* 3. Danh mục lấy từ Database */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Danh mục sản phẩm</label>
            <select name="category" 
                    className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none"
                    onChange={handleInputChange} value={formData.category}>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="">Đang tải danh mục...</option>
              )}
            </select>
          </div>

          {/* 4. Mô tả */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Mô tả chi tiết</label>
            <textarea name="description" rows="3" placeholder="Nhập mô tả cho hoa..."
                      className="w-full mt-1 p-2.5 bg-white border border-pink-100 rounded-xl outline-none resize-none"
                      onChange={handleInputChange}></textarea>
          </div>

          {/* 5. Hình ảnh */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">Hình ảnh hoa (Tối đa 4)</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[0,1,2,3].map(i => (
                <div key={i} className="relative aspect-square bg-white border-2 border-dashed border-pink-200 rounded-xl flex items-center justify-center overflow-hidden hover:border-[#881337]">
                  {previews[i] ? <img src={previews[i]} className="w-full h-full object-cover" alt="" /> : <span className="text-pink-300 text-xl">+</span>}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleSelectFile(i, e)} />
                </div>
              ))}
            </div>
          </div>

          {/* Nút bấm */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={handleClose} 
                    className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl font-bold uppercase text-xs">Hủy</button>
            <button type="submit" disabled={loading} 
                    className={`flex-1 ${loading ? 'bg-gray-400' : 'bg-[#881337]'} text-white py-3 rounded-xl font-bold uppercase text-xs shadow-md`}>
              {loading ? "Đang lưu..." : "Xác nhận thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;