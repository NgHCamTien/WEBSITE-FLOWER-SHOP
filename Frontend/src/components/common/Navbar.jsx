import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const categories = [
    { name: "Hoa Sinh Nhật", slug: "hoa-sinh-nhat" },
    { name: "Hoa Khai Trương", slug: "hoa-khai-truong" },
    { name: "Hoa Cưới", slug: "hoa-cuoi" },
    { name: "Bó Hoa", slug: "bo-hoa" },
  ];

  return (
    <nav className="bg-[#1e293b] text-white w-full sticky top-[120px] z-40">
      <div className="max-w-7xl mx-auto flex justify-center py-3 px-6">
        <ul className="flex items-center gap-10 text-sm font-medium uppercase tracking-wider">
          <li><Link to="/" className="hover:text-pink-400 transition">Trang chủ</Link></li>
          <li><Link to="/product" className="hover:text-pink-400 transition">Sản phẩm</Link></li>
          
          {/* Dropdown đơn giản bằng CSS */}
          <li className="group relative cursor-pointer">
            <span className="hover:text-pink-400">Danh mục ▾</span>
            <div className="absolute hidden group-hover:block top-full left-0 bg-white text-gray-800 shadow-xl rounded-lg mt-2 w-48 overflow-hidden border border-gray-100">
              {categories.map((cat) => (
                <Link key={cat.slug} to={`/category/${cat.slug}`} className="block px-4 py-3 hover:bg-pink-50 hover:text-pink-600 transition border-b border-gray-50 last:border-none">
                  {cat.name}
                </Link>
              ))}
            </div>
          </li>

          <li><Link to="/about" className="hover:text-pink-400 transition">Giới thiệu</Link></li>
          <li><Link to="/contact" className="hover:text-pink-400 transition">Liên hệ</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;