import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Đường dẫn gốc của Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// TỰ ĐỘNG GẮN TOKEN VÀO MỌI YÊU CẦU (Interceptor)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Lấy token từ máy khách
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn vào header cho Backend kiểm tra
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TỰ ĐỘNG XỬ LÝ KẾT QUẢ TRẢ VỀ
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Chỉ lấy dữ liệu thật, bỏ qua các thông tin rác của axios
  },
  (error) => {
    // Nếu token hết hạn (lỗi 401), có thể tự động đẩy user về trang Login ở đây
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;