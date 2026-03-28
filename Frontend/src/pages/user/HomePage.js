import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = [
    {
      image: "https://i.pinimg.com/1200x/7c/95/bb/7c95bb1faea6b01ae34d00c46d15a983.jpg",
      title: "Hoa Tươi Mỗi Ngày 🌸",
      subtitle: "Giảm giá đến 30% – Giao hàng nhanh & tận tâm",
    },
    {
      image: "https://i.pinimg.com/1200x/ca/81/d3/ca81d3448e06f6b153ccf082770ca039.jpg",
      title: "Trao Yêu Thương 💐",
      subtitle: "Thiết kế độc đáo – Sang trọng – Tinh tế",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pb-10">
      {/* 🌸 Hero Banner */}
      <section className="relative my-6 mx-auto max-w-6xl rounded-2xl overflow-hidden shadow-lg h-[350px] md:h-[450px]">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-4">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{banner.title}</h2>
              <p className="text-lg mb-6">{banner.subtitle}</p>
              <Link to="/products" className="bg-[#ff8fab] hover:bg-[#ff6b81] px-8 py-3 rounded-full font-bold transition-transform hover:scale-105">
                Mua Ngay
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 🌿 Sản phẩm nổi bật (Dữ liệu mẫu) */}
      <section className="py-12 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[#4b2c2b] mb-8">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group border border-pink-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all">
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-pink-50 flex items-center justify-center text-pink-200">Ảnh Hoa</div>
              </div>
              <h3 className="font-semibold text-gray-800">Bó Hoa Tình Yêu #{item}</h3>
              <p className="text-pink-500 font-bold mt-2">500.000đ</p>
              <button className="mt-4 w-full py-2 bg-gray-800 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;