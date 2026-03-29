import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ProductCard from '../../components/product/ProductCard';

const banners = [
  {
    image: "https://i.pinimg.com/1200x/7c/95/bb/7c95bb1faea6b01ae34d00c46d15a983.jpg",
    title: "Hoa Tươi Mỗi Ngày 🌸",
    subtitle: "Giảm giá đến 30% – Giao hàng nhanh & tận tâm",
  },
  {
    image: "https://i.pinimg.com/1200x/ca/81/d3/ca81d3448e06f6b153ccf082770ca039.jpg",
    title: "Trao Yêu Thương Qua Từng Cánh Hoa 💐",
    subtitle: "Thiết kế độc đáo – Sang trọng – Tinh tế",
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // 1. Tự động chuyển Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 2. Lấy dữ liệu sản phẩm (Có fallback dữ liệu mẫu nếu API lỗi)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products?limit=8`);
        if (response.data && response.data.products) {
          setFeaturedProducts(response.data.products);
        }
      } catch (err) {
        console.error('API Error, sử dụng dữ liệu mẫu:', err);
        // Đổ dữ liệu mẫu để Tiên thấy UI ngay lập tức
        setFeaturedProducts([
          { _id: '1', name: 'Bó Hoa Nắng Mai', price: 500000, discountPrice: 450000, thumbnail: '/DDT.png' },
          { _id: '2', name: 'Hoa Hồng Red Naomi', price: 600000, thumbnail: '/DDT.png' },
          { _id: '3', name: 'Lẵng Hoa Khai Trương', price: 1200000, discountPrice: 990000, thumbnail: '/DDT.png' },
          { _id: '4', name: 'Bó Hoa Cẩm Tú Cầu', price: 400000, thumbnail: '/DDT.png' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDFD]">
      {/* Chỉ giữ Header (Navbar đã nằm trong Header mẫu bạn gửi) */}
      <Header />

<main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pt-0"> 
  {/* pt-0 để xóa bỏ mọi khoảng cách phía trên */}

  {/* 🌸 Hero Banner */}
  <section className="relative -mt-4 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-pink-100/30 h-[300px] md:h-[500px]">
    {/* Dùng -mt-4 (âm 4) để kéo hẳn cái banner nhích lên trên thêm một chút nữa */}
    {/* Giảm mt-8 xuống mt-2 để nhích lên trên */}
    {banners.map((banner, index) => (
      // ... giữ nguyên phần nội dung bên trong ...
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                index === currentIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 z-0"
              }`}
            >
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover brightness-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 z-20">
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl mb-8 italic text-pink-50">
                  {banner.subtitle}
                </p>
                <Link to="/product" className="bg-[#e06c7f] hover:bg-[#d35d75] text-white font-bold px-10 py-3 rounded-full shadow-lg transition-all hover:scale-105">
                  Khám phá ngay
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* 🌿 Sản phẩm nổi bật */}
        <section className="py-20 text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4b2c2b]">
               Sản phẩm bán chạy nhất
            </h2>
            <div className="w-20 h-1.5 bg-[#e06c7f] mx-auto mt-4 rounded-full"></div>
          </div>
            
          {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#e06c7f]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          )}
          
          <Link to="/product" className="inline-block mt-16 text-[#e06c7f] font-bold border-b-2 border-[#e06c7f] hover:text-[#d35d75] transition-all">
            Xem tất cả bộ sưu tập →
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;