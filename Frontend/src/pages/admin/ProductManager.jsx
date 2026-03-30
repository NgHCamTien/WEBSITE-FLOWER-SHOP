import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct'; 

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products').then(res => {
      if (res.data.success) setProducts(res.data.products);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- HÀM CHỐT LẤY ẢNH TỪ MONGODB ---
  const getImageUrl = (imgName) => {
    if (!imgName) return "/DDT.png"; 
    
    // Nếu đã là link full (Pinterest/FB) thì trả về luôn
    if (imgName.startsWith('http')) return imgName;
    
    // Xử lý tên file bốc từ Database (Xóa 'uploads/' nếu lỡ có và đổi dấu xẹt)
    const cleanName = imgName.replace('uploads/', '').replace(/\\/g, '/');
    return `http://localhost:5000/uploads/${cleanName}`;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#881337]">KHO HOA TƯƠI</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-[#881337] text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-[#6b0f2b] transition-all">
          + NHẬP HOA MỚI
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-pink-50 text-[#881337] text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Ảnh</th>
              <th className="p-4 text-left">Tên sản phẩm</th>
              <th className="p-4">Giá</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                <td className="p-2">
                  {/* SỬA DÒNG NÀY ĐỂ HIỆN ẢNH ĐỒNG BỘ */}
                  <img 
                    src={getImageUrl(p.image || p.thumbnail?.[0])} 
                    className="w-14 h-14 mx-auto rounded-xl object-cover border border-pink-100 shadow-sm" 
                    alt={p.name}
                    onError={(e) => { e.target.src = "/DDT.png" }} 
                  />
                </td>
                <td className="font-bold text-gray-700 text-left p-4">{p.name}</td>
                <td className="text-pink-600 font-bold">{p.price?.toLocaleString()}đ</td>
                <td className="space-x-4">
                   <button onClick={() => setEditingProduct(p)} className="text-blue-500 text-xs font-bold hover:underline">SỬA</button>
                   
                   <button onClick={() => {
                     if(window.confirm("Xóa thiệt hả Tiên? 🌸")) {
                       axios.delete(`http://localhost:5000/api/products/${p._id}`).then(() => fetchProducts())
                     }
                   }} className="text-red-400 text-xs font-bold hover:underline">XÓA</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddProduct 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onRefresh={fetchProducts} 
      />

      {editingProduct && (
        <EditProduct 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onRefresh={fetchProducts} 
        />
      )}
    </div>
  );
};

export default ProductManager;