import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Overview = () => {
  const data = [
    { name: 'T2', revenue: 4000 }, { name: 'T3', revenue: 3000 },
    { name: 'T4', revenue: 5000 }, { name: 'T5', revenue: 2780 },
    { name: 'T6', revenue: 1890 }, { name: 'T7', revenue: 6390 }, { name: 'CN', revenue: 8490 },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* PHẦN TIÊU ĐỀ VÀ LỜI CHÀO RIÊNG CHO TRANG TỔNG QUAN */}
      <div className="flex justify-between items-end mb-10 px-2">
        <div>
          <h1 className="text-3xl font-bold text-[#881337] tracking-tight">
            Bảng theo dõi kinh doanh
          </h1>
          <p className="text-gray-400 italic text-sm mt-2">
            Chào sếp Tiên, chúc shop hôm nay bão đơn! 🌸
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-pink-300 uppercase tracking-[0.2em]">Cập nhật lần cuối</p>
          <p className="text-xs text-gray-500 font-medium">Hôm nay, 18:30</p>
        </div>
      </div>

      {/* Cards thống kê rực rỡ */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        <div className="bg-[#FEF2F4] p-8 rounded-[2rem] shadow-lg shadow-pink-100/50 flex flex-col items-center border border-pink-100 relative overflow-hidden">
          <span className="absolute -top-5 -left-5 text-6xl text-pink-100 opacity-50">💐</span>
          <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 z-10">Sản phẩm</p>
          <h3 className="text-4xl font-bold text-[#881337] z-10">48 <span className="text-xl">bó</span></h3>
        </div>
        
        <div className="bg-[#FFF1F2] p-8 rounded-[2rem] shadow-lg shadow-rose-100/50 flex flex-col items-center border border-rose-100 relative overflow-hidden">
           <span className="absolute -top-5 -left-5 text-6xl text-rose-100 opacity-50">🛒</span>
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2 z-10">Đơn hàng mới</p>
          <h3 className="text-4xl font-bold text-[#e06c7f] z-10">24</h3>
        </div>

        <div className="bg-[#F0FDF4] p-8 rounded-[2rem] shadow-lg shadow-green-100/50 flex flex-col items-center border border-green-100 relative overflow-hidden">
          <span className="absolute -top-5 -left-5 text-6xl text-green-100 opacity-50">👥</span>
          <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-2 z-10">Khách hàng</p>
          <h3 className="text-4xl font-bold text-green-700 z-10">+15</h3>
        </div>
      </div>

      {/* Biểu đồ doanh thu chuyên nghiệp */}
      <div className="bg-[#FEF2F4]/50 p-10 rounded-[2.5rem] shadow-inner border border-pink-100">
        <h3 className="text-sm font-bold text-[#881337]/70 uppercase tracking-[0.2em] mb-10 text-center">
          Doanh thu tuần này (Triệu VNĐ)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#e06c7f', fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip cursor={{fill: 'white'}} contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
              <Bar dataKey="revenue" fill="#e06c7f" radius={[15, 15, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;