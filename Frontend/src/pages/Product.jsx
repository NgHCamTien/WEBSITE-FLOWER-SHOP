import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductFilter from '../components/user/ProductFilter'; 
import ProductList from '../components/user/ProductList';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 1. STATE QUẢN LÝ BỘ LỌC & SẮP XẾP ---
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState({ label: "Tất cả giá", min: 0, max: 10000000 });
  const [sortOption, setSortOption] = useState('latest'); // Mặc định hoa mới nhất

  // --- 2. LOGIC LẤY DỮ LIỆU TỪ SERVER ---
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/products`, {
          params: {
            category: selectedCategory !== "Tất cả" ? selectedCategory : undefined,
            minPrice: selectedPrice.min,
            maxPrice: selectedPrice.max,
            sort: sortOption // Gửi lựa chọn sắp xếp xuống Backend
          }
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Lỗi lọc sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredProducts();
    // Chạy lại mỗi khi Tiên bấm nút lọc hoặc chọn sắp xếp
  }, [selectedCategory, selectedPrice, sortOption]); 

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDFD]">
      <Header />
      
      {/* --- 3. ĐIỀU CHỈNH KHOẢNG CÁCH (Nhích lên sát Header) --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-0 -mt-10"> 
        {/* Dùng -mt-10 để kéo hẳn nội dung lên sát thanh menu nhất */}
        
        <div className="py-4">
          {/* Tiêu đề nhỏ gọn để nhường chỗ cho ảnh/bộ lọc */}
          <h1 className="text-lg font-serif font-bold text-[#4b2c2b] text-center mb-6 uppercase tracking-[0.2em]">
            BST Hoa Tươi
          </h1>

          {/* Gọi Bộ lọc và truyền các hàm điều khiển State */}
          <ProductFilter 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            selectedPrice={selectedPrice}
            setSelectedPrice={setSelectedPrice}
          />

          {/* Thanh Sắp xếp nhanh (Nằm ngay trên danh sách hoa) */}
          <div className="flex justify-end mb-6 px-2">
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-black/5 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl outline-none shadow-sm"
            >
              <option value="latest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
            </select>
          </div>

          {/* Hiển thị danh sách sản phẩm sau khi đã lọc */}
          {loading ? (
            <div className="text-center py-20 italic text-gray-300 text-[10px] uppercase tracking-widest">
              Đang tìm hoa cho Tiên...
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;