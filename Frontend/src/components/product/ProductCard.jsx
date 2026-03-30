import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { FaHeart, FaPlus } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext) || {};
  const API_URL = 'http://localhost:5000';

  if (!product) return null;

  // --- 🛠 PHẦN LOGIC ẢNH ĐÃ SỬA ĐỂ ĐỒNG BỘ VỚI SERVER ---
  
  // 1. Lấy tên file ảnh (Ưu tiên thumbnail[0] rồi đến image)
  const imagePath = (product.thumbnail && product.thumbnail.length > 0) 
    ? product.thumbnail[0] 
    : (product.image || '');

  // 2. Chốt hạ đường dẫn chuẩn xác
  const imageSrc = (typeof imagePath === 'string' && imagePath.startsWith('http'))
    ? imagePath // Link Pinterest/Web thì giữ nguyên
    : imagePath 
      // Nếu là ảnh local: thêm /uploads/, xóa 'uploads/' thừa và đổi dấu \ thành /
      ? `${API_URL}/uploads/${imagePath.replace('uploads/', '').replace(/\\/g, '/')}` 
      : '/placeholder.png';

  // --- 🛠 HẾT PHẦN SỬA ---

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if (addToCart) {
      // Gửi sang giỏ hàng với imageSrc đã được xử lý chuẩn
      addToCart({ ...product, image: imageSrc, quantity: 1 });
      alert(`Đã thêm "${product.name}" vào giỏ hàng! 🌸`);
    }
  };

  return (
    <Link
      to={`/product-detail/${product._id}`}
      className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(255,182,193,0.3)] hover:-translate-y-3 flex flex-col h-full border border-pink-50"
    >
      {/* 🖼️ PHẦN ẢNH (Bo góc tròn xoe - GIỮ NGUYÊN LAYOUT) */}
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-pink-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => (e.currentTarget.src = '/placeholder.png')}
        />
        
        {/* Nút yêu thích nhỏ xinh */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <FaHeart size={12} />
        </div>
      </div>

      {/* 📝 PHẦN THÔNG TIN (GIỮ NGUYÊN LAYOUT) */}
      <div className="pt-6 pb-2 px-2 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-1">
          {product.category || 'DDT Flower'}
        </span>

        <h3 className="font-serif text-lg font-bold text-[#4b2c2b] mb-4 line-clamp-2 leading-snug group-hover:text-[#e06c7f] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Giá bán</span>
            <span className="text-xl font-black text-[#e06c7f] tracking-tighter">
              {(product.price || 0).toLocaleString('vi-VN')}₫
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-12 h-12 bg-[#4b2c2b] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 hover:bg-[#e06c7f] hover:shadow-pink-200 transition-all duration-300 active:scale-90"
            title="Thêm vào giỏ hàng"
          >
            <FaPlus size={16} />
          </button>
        </div>
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink-50/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </Link>
  );
};

export default ProductCard;