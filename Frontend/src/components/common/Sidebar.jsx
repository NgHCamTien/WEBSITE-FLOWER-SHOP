// 1. Import thêm useParams từ react-router-dom
import React from 'react';
import { Link, useParams } from 'react-router-dom'; 

const Sidebar = () => {
  // 2. Lấy biến slug từ URL xuống
  const { slug } = useParams(); 

  const categories = [
    { id: '1', name: 'Hoa sinh nhật', slug: 'hoa-sinh-nhat' },
    { id: '2', name: 'Hoa khai trương', slug: 'hoa-khai-truong' },
    // Thêm các danh mục khác...
  ];

  return (
    <aside className="bg-white p-6 w-full max-w-[280px] rounded-3xl border border-pink-50 shadow-xl shadow-pink-50/50 sticky top-44">
      <h3 className="font-bold text-xl mb-6 text-[#4b2c2b] border-b-2 border-pink-100 pb-3">
        Danh mục sản phẩm
      </h3>
      
      <Link to="/admin/email" className="flex items-center justify-center gap-2 bg-[#e06c7f] text-white py-3 rounded-2xl mb-6 font-bold hover:bg-[#d35d75] shadow-lg shadow-pink-200 transition-all">
        📩 Gửi Khuyến Mãi
      </Link>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}> {/* Lưu ý: Dùng category.id thay vì category._id nếu dữ liệu mẫu là id */}
            <Link 
              to={`/category/${category.slug}`} 
              className={`block px-4 py-3 rounded-xl transition-all ${
                slug === category.slug 
                ? 'bg-[#fce4e8] text-[#e06c7f] font-bold' 
                : 'text-gray-600 hover:bg-pink-50 hover:text-[#e06c7f]'
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;