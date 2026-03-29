import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../../components/product/ProductCard';
import Sidebar from '../../components/common/Sidebar';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('latest');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 10000000,
    color: '',    // Thêm để đồng bộ với bộ lọc mới
    occasion: ''  // Thêm để đồng bộ với bộ lọc mới
  });

  useEffect(() => {
    // Tạo controller để hủy request nếu khách bấm lọc quá nhanh
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`, {
          params: {
            category: filters.category || undefined,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            color: filters.color || undefined,
            occasion: filters.occasion || undefined,
            sort: sortOption
          },
          signal: controller.signal // Gắn signal vào đây
        });

        if (res.data && res.data.products) {
          setProducts(res.data.products);
          // Cuộn nhẹ lên đầu danh sách khi có kết quả mới
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } catch (err) {
        if (axios.isCancel(err)) return; // Nếu là lệnh hủy thì bỏ qua lỗi
        console.error("Lỗi khi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Hàm dọn dẹp (Cleanup)
    return () => controller.abort();
  }, [filters, sortOption]); 

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-0 mt-[-20px]">
      <div className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-64 shrink-0">
          {/* Đảm bảo Sidebar của Tiên có nhận và dùng hàm này */}
          <Sidebar onFilterChange={(newFilters) => setFilters(prev => ({...prev, ...newFilters}))} />
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-4 rounded-3xl border border-black/[0.03] shadow-sm">
            <h2 className="text-lg font-serif font-bold text-[#4b2c2b]">
              Sản phẩm hiện có <span className="text-[#e06c7f] text-xs">({products.length})</span>
            </h2>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Sắp xếp:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-[#FAF9F9] text-[#4b2c2b] text-[11px] font-bold px-4 py-2 rounded-xl outline-none border border-black/5 cursor-pointer hover:bg-white transition-colors"
              >
                <option value="latest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
              </select>
            </div>
          </div>

          {/* Grid Sản phẩm */}
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
               <div className="w-8 h-8 border-4 border-[#e06c7f] border-t-transparent rounded-full animate-spin"></div>
               <p className="italic text-gray-300 text-[10px] uppercase tracking-[0.2em]">Đang tìm hoa cho Tiên...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-black/5">
              <p className="text-gray-300 text-sm italic">Hết mẫu hoa này rồi, Tiên chọn mẫu khác nhé! 🌸</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;