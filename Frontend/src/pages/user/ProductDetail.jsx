import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { FaShoppingCart, FaStar, FaChevronLeft, FaChevronRight, FaShareAlt } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState(0);

  const { addToCart } = useContext(CartContext) || {};
  const API_URL = 'http://localhost:5000';

  // --- HÀM LẤY ẢNH ĐÃ SỬA ---
  const getImageUrl = (imgName) => {
      if (!imgName) return "/DDT.png"; 
      if (imgName.startsWith('http')) return imgName;
      const cleanName = imgName.replace('uploads/', '').replace(/\\/g, '/');
      return `${API_URL}/uploads/${cleanName}`;
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
          const relatedRes = await axios.get(`${API_URL}/api/products?category=${res.data.product.category}`);
          setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        console.error("Lỗi fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const nextImage = () => {
    setMainImage((prev) => (prev === (product.thumbnail?.length || 1) - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setMainImage((prev) => (prev === 0 ? (product.thumbnail?.length || 1) - 1 : prev - 1));
  };

  if (loading) return <div className="text-center py-20 italic text-pink-400 font-bold">Đang chuẩn bị hoa cho Tiên... 🌸</div>;
  if (!product) return <div className="text-center py-20 text-gray-400">Không tìm thấy mẫu hoa này rồi! 🥀</div>;

  const images = product.thumbnail || ['/placeholder.png'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700">
      
      {/* 1. THÔNG TIN CHÍNH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-pink-50">
        
        {/* CỘT TRÁI: THƯ VIỆN ẢNH CÓ NÚT BẤM */}
        <div className="space-y-6">
          <div className="aspect-square rounded-[2rem] overflow-hidden border border-pink-50 shadow-inner relative group bg-white">
            {/* SỬA ẢNH CHÍNH Ở ĐÂY */}
            <img 
              src={getImageUrl(images[mainImage])} 
              className="w-full h-full object-cover transition-all duration-500" 
              alt={product.name} 
              onError={(e) => (e.currentTarget.src = '/DDT.png')}
            />

            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#e06c7f] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#e06c7f] hover:text-white">
              <FaChevronLeft size={14} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#e06c7f] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-[#e06c7f] hover:text-white">
              <FaChevronRight size={14} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="bg-black/30 text-white text-[10px] px-3 py-1 rounded-full backdrop-blur-md font-bold tracking-widest">
                {mainImage + 1} / {images.length}
              </div>
            </div>
          </div>
          
          {/* SỬA ẢNH THUMBNAILS Ở ĐÂY */}
          <div className="flex gap-3 justify-center overflow-x-auto py-2 px-1">
            {images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setMainImage(idx)}
                className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  mainImage === idx ? 'border-[#e06c7f] scale-95 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <span>Chia sẻ:</span>
            <FaShareAlt className="cursor-pointer hover:text-[#e06c7f] transition-colors" />
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT & ĐẶT HÀNG */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-serif font-bold text-[#4b2c2b] mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400 text-xs"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            <span className="text-xs text-gray-400 font-medium tracking-wide">(4.8/5 đánh giá từ khách hàng)</span>
          </div>
          
          <div className="text-4xl font-black text-[#e06c7f] mb-8 tracking-tighter">
            {product.price?.toLocaleString()}₫
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6 bg-pink-50/30 p-4 rounded-2xl w-fit">
              <span className="font-bold text-xs text-[#4b2c2b] uppercase tracking-widest">Số lượng:</span>
              <div className="flex items-center border-2 border-white rounded-full bg-white shadow-sm overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-2 hover:bg-pink-50 transition-colors font-bold">-</button>
                <span className="px-6 py-2 font-bold w-12 text-center text-[#e06c7f]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-5 py-2 hover:bg-pink-50 transition-colors font-bold">+</button>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                // SỬA LINK ẢNH KHI GỬI VÀO GIỎ HÀNG
                onClick={() => addToCart({ ...product, quantity, image: getImageUrl(images[0]) })}
                className="flex-[2] bg-pink-100 text-[#e06c7f] py-4 rounded-2xl font-bold hover:bg-[#e06c7f] hover:text-white transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest active:scale-95"
              >
                <FaShoppingCart /> Thêm vào giỏ
              </button>
              <button className="flex-1 bg-[#e06c7f] text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-pink-200 uppercase text-xs tracking-widest active:scale-95">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABS (GIỮ NGUYÊN) */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-pink-50">
        <div className="flex gap-10 border-b border-pink-50 mb-8">
          {['description', 'info'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 font-bold text-xs uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? 'text-[#e06c7f]' : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              {tab === 'description' ? 'Mô tả sản phẩm' : 'Thông tin sản phẩm'}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#e06c7f] rounded-full animate-in fade-in zoom-in duration-300" />}
            </button>
          ))}
        </div>
        
        <div className="text-gray-500 leading-relaxed text-sm">
          {activeTab === 'description' ? (
            <p className="first-letter:text-4xl first-letter:font-serif first-letter:text-[#e06c7f] first-letter:mr-2 first-letter:float-left">
                {product.description || 'Sản phẩm hoa tươi cao cấp từ DDT Flower Shop, mang trọn yêu thương gửi đến người thân yêu của bạn.'}
            </p>
          ) : (
            <ul className="space-y-4">
              <li className="flex gap-4"><strong className="w-24 text-gray-800">Danh mục:</strong> <span>{product.category}</span></li>
              <li className="flex gap-4"><strong className="w-24 text-gray-800">Tình trạng:</strong> <span className="text-green-500 font-bold italic">Còn hoa tươi mới</span></li>
              <li className="flex gap-4 text-xs italic text-gray-400">Lưu ý: Hình ảnh chỉ mang tính chất minh họa, hoa có thể thay đổi nhẹ tùy theo mùa.</li>
            </ul>
          )}
        </div>
      </div>

      {/* 3. ĐÁNH GIÁ (GIỮ NGUYÊN) */}
      <div className="bg-[#FEF2F4]/50 rounded-[2.5rem] p-8 md:p-12 border border-pink-100 shadow-inner">
        <h3 className="font-bold text-[#881337] uppercase tracking-[0.3em] mb-10 text-center text-sm">Cảm nhận khách hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-pink-50">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-bold text-[#e06c7f]">U</div>
                    <span className="font-bold text-gray-800 text-sm">Người dùng hệ thống</span>
                </div>
                <div className="flex text-yellow-400 text-[10px]"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed italic">"Hoa rất đẹp và tươi, dịch vụ giao hàng đúng hẹn. Tiên tư vấn rất nhiệt tình, mình sẽ ủng hộ shop dài dài!"</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. GỢI Ý SẢN PHẨM (SỬA ẢNH Ở ĐÂY) */}
      <div className="space-y-10 pt-4">
        <div className="flex justify-between items-end px-2">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-[#4b2c2b]">Bạn có thể thích</h2>
            <div className="w-12 h-1 bg-[#e06c7f] rounded-full" />
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 rounded-full border border-pink-100 flex items-center justify-center text-gray-300 hover:bg-[#e06c7f] hover:text-white transition-all shadow-sm"><FaChevronLeft size={12}/></button>
            <button className="w-12 h-12 rounded-full border border-pink-100 flex items-center justify-center text-gray-300 hover:bg-[#e06c7f] hover:text-white transition-all shadow-sm"><FaChevronRight size={12}/></button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(p => (
            <Link to={`/product-detail/${p._id}`} key={p._id} className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-pink-50 p-4 hover:-translate-y-2 transition-all duration-500">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
                {/* SỬA ẢNH SẢN PHẨM GỢI Ý */}
                <img src={getImageUrl(p.image || p.thumbnail?.[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-sm font-bold text-gray-700 truncate px-2 group-hover:text-[#e06c7f] transition-colors text-center">{p.name}</h4>
              <p className="text-[#e06c7f] font-black text-center mt-2 text-base tracking-tight">{p.price?.toLocaleString()}₫</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;