import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import Sidebar from '../../components/common/Sidebar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('latest');

  // Logic lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`);
        if (res.data && res.data.products) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        // Dữ liệu giả lập nếu API chưa sẵn sàng để Cam Tiên check UI
        setProducts([
          { _id: '1', name: 'Bó Hoa Hướng Dương Hy Vọng', price: 450000, discountPrice: 390000, thumbnail: '/DDT.png' },
          { _id: '2', name: 'Giỏ Hoa Hồng Đỏ Ecuador', price: 850000, thumbnail: '/DDT.png' },
          { _id: '3', name: 'Bó Hoa Baby Trắng Tinh Khôi', price: 300000, discountPrice: 250000, thumbnail: '/DDT.png' },
          { _id: '4', name: 'Lẵng Hoa Khai Trương Hồng Phát', price: 1500000, thumbnail: '/DDT.png' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* --- CỘT TRÁI: SIDEBAR (Bộ lọc) --- */}
        <div className="w-full md:w-64 shrink-0">
          <Sidebar />
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH SẢN PHẨM --- */}
        <div className="flex-1">
          {/* Header của danh sách: Tiêu đề & Sắp xếp */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-3xl border border-pink-50 shadow-sm">
            <h2 className="text-xl font-serif font-bold text-[#4b2c2b] mb-4 sm:mb-0">
              Tất cả sản phẩm <span className="text-[#e06c7f] text-sm font-sans">({products.length})</span>
            </h2>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Sắp xếp:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-pink-50 text-[#e06c7f] text-sm font-bold px-4 py-2 rounded-xl outline-none border-none focus:ring-2 focus:ring-pink-200 transition-all"
              >
                <option value="latest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>
          </div>

          {/* Lưới sản phẩm */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#e06c7f]"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-pink-200">
              <p className="text-gray-400">Rất tiếc, không tìm thấy sản phẩm nào 🌸</p>
            </div>
          )}

          {/* Phân trang (UI mẫu) */}
          <div className="mt-12 flex justify-center gap-2">
            {[1, 2, 3].map((page) => (
              <button 
                key={page}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${page === 1 ? 'bg-[#e06c7f] text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-pink-50'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductList;