import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  
  // 1. Lấy thông tin sản phẩm đầu tiên từ mảng items
  const firstItem = order?.items?.[0];
  const productInfo = firstItem?.productId; 
  
  // 2. Xử lý đường dẫn ảnh
  const itemImage = productInfo?.image; 
  const imageUrl = itemImage?.startsWith('http') 
    ? itemImage 
    : itemImage 
      ? `http://localhost:5000/${itemImage}` 
      : 'https://via.placeholder.com/150?text=DDT+Flower';

  const getStatusColor = (status) => {
    const colors = {
      'Chờ xác nhận': 'bg-orange-100 text-orange-600',
      'Đang xử lý': 'bg-blue-100 text-blue-600',
      'Đang giao': 'bg-purple-100 text-purple-600',
      'Đã giao': 'bg-green-100 text-green-600',
      'Đã hủy': 'bg-red-100 text-red-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="bg-white border border-pink-100 rounded-2xl p-5 mb-4 flex items-center justify-between hover:shadow-md transition-all group">
      <div className="flex items-center gap-5">
        {/* Khung ảnh sản phẩm */}
        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-pink-50 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={productInfo?.name || "Product"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Hoa+DDT'; }}
          />
        </div>
        
        <div className="flex flex-col gap-1">
          {/* Mã đơn hàng an toàn */}
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Mã đơn: #{order?._id ? order._id.slice(-6) : '......'}
          </p>
          
          <h4 className="font-bold text-gray-800 line-clamp-1">
            {productInfo?.name || 'Sản phẩm đang cập nhật'}
          </h4>
          
          <p className="text-xs text-gray-500">
            Số lượng: {firstItem?.quantity || 0}
            {order?.items?.length > 1 && ` (+${order.items.length - 1} món khác)`}
          </p>
          
          <p className="text-[#B58383] font-bold text-lg">
            {Number(order?.totalAmount || 0).toLocaleString()}đ
          </p>
        </div>
      </div>

      <div className="text-right flex flex-col justify-between h-20">
        <div>
          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-tight ${getStatusColor(order?.status)}`}>
            {order?.status || 'Chờ xử lý'}
          </span>
        </div>
        
        <button 
          onClick={() => navigate(`/order-detail/${order?._id}`)}
          className="text-xs font-bold text-gray-400 hover:text-[#B58383] transition-colors flex items-center justify-end gap-1 group/btn"
        >
          CHI TIẾT 
          <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default OrderCard;