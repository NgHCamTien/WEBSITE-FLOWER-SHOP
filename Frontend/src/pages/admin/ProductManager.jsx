import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct'; // Tiên sẽ tạo file này ở bước dưới

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // State giữ sản phẩm đang sửa

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products').then(res => {
      if (res.data.success) setProducts(res.data.products);
    });
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#881337]">KHO HOA TƯƠI</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-[#881337] text-white px-6 py-2 rounded-full font-bold">
          + NHẬP HOA MỚI
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        <table className="w-full text-center">
          <thead className="bg-pink-50 text-[#881337] text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Ảnh</th><th className="p-4">Tên</th><th className="p-4">Giá</th><th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b border-pink-50">
                <td className="p-2">
                  <img src={p.thumbnail?.[0] ? `http://localhost:5000${p.thumbnail[0]}` : "/DDT.png"} className="w-12 h-12 mx-auto rounded-lg object-cover" alt=""/>
                </td>
                <td className="font-bold text-gray-700">{p.name}</td>
                <td className="text-pink-600 font-bold">{p.price?.toLocaleString()}đ</td>
                <td className="space-x-4">
                   {/* NÚT SỬA */}
                   <button onClick={() => setEditingProduct(p)} className="text-blue-500 text-xs font-bold underline">SỬA</button>
                   
                   {/* NÚT XÓA */}
                   <button onClick={() => {
                     if(window.confirm("Xóa thiệt hả Tiên?")) {
                       axios.delete(`http://localhost:5000/api/products/${p._id}`).then(() => fetchProducts())
                     }
                   }} className="text-red-400 text-xs font-bold underline">XÓA</button>
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

      {/* MODAL SỬA */}
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