import React from 'react';

const Sidebar = ({ onFilterChange, selectedCategory }) => {
  // Danh mục hoa (Tiên có thể thêm nhiều hơn ở đây)
  const categories = [
    { id: 'all', name: 'Tất cả hoa', value: 'Tất cả' },
    { id: '1', name: 'Hoa sinh nhật', value: 'Hoa sinh nhật' },
    { id: '2', name: 'Hoa khai trương', value: 'Hoa khai trương' },
    { id: '3', name: 'Hoa cưới', value: 'Hoa cưới' },
    { id: '4', name: 'Hoa giỏ', value: 'Hoa giỏ' },
  ];

  return (
    <aside className="bg-white p-6 w-full max-w-[280px] rounded-3xl border border-pink-50 shadow-xl shadow-pink-50/50 sticky top-44 animate-in fade-in slide-in-from-left-4 duration-700">
      <h3 className="font-bold text-lg mb-6 text-[#4b2c2b] border-b-2 border-pink-100 pb-3 uppercase tracking-widest">
        Danh mục sản phẩm
      </h3>
      
      {/* Nút gửi khuyến mãi (Giữ nguyên của Tiên) */}
      <button className="w-full flex items-center justify-center gap-2 bg-[#e06c7f] text-white py-3 rounded-2xl mb-6 font-bold hover:bg-[#d35d75] shadow-lg shadow-pink-200 transition-all active:scale-95 text-xs uppercase tracking-tighter">
        📩 Gửi Khuyến Mãi
      </button>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <button 
              onClick={() => onFilterChange({ category: category.value })} 
              className={`w-full text-left px-5 py-3 rounded-xl transition-all text-sm ${
                selectedCategory === category.value 
                ? 'bg-[#fce4e8] text-[#e06c7f] font-bold shadow-sm' 
                : 'text-gray-500 hover:bg-pink-50 hover:text-[#e06c7f]'
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Tiên có thể thêm bộ lọc giá vào dưới này luôn cho xịn */}
      <div className="mt-8 pt-6 border-t border-pink-100">
         <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 mb-4">Khoảng giá</h4>
         <div className="grid grid-cols-1 gap-2">
            <button onClick={() => onFilterChange({ minPrice: 0, maxPrice: 500000 })} className="text-left text-xs text-gray-400 hover:text-[#e06c7f]">Dưới 500.000₫</button>
            <button onClick={() => onFilterChange({ minPrice: 500000, maxPrice: 1000000 })} className="text-left text-xs text-gray-400 hover:text-[#e06c7f]">500k - 1 triệu</button>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;