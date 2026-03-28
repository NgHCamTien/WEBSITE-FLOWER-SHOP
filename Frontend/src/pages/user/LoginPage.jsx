import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  // Giả sử AuthContext của bạn đã có các hàm này
  const { login, register, setUser } = useContext(AuthContext) || {}; 

  // --- FACEBOOK LOGIN ---
  const handleFacebookLogin = () => {
    const FACEBOOK_APP_ID = "1180477920674027";
    const redirectUri = window.location.origin + "/auth/facebook/callback";
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=dtp_flowershop&response_type=token&scope=email,public_profile`;
    window.location.href = url;
  };

  // --- GOOGLE LOGIN ---
  const googleLoginCustom = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        // Logic gọi API backend của bạn ở đây...
        console.log("Google User:", userInfo.data);
        // Sau khi thành công: navigate("/");
      } catch (err) {
        setError("Lỗi Google Login!");
      }
    },
    onError: () => setError("Đăng nhập Google thất bại!"),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (login) {
        const result = await login(email, password);
        if (result?.success) navigate(result.user.role === "admin" ? "/admin" : "/");
        else setError(result?.message || "Sai thông tin đăng nhập!");
    } else {
        setError("AuthContext chưa được thiết lập đúng.");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (register) {
        const result = await register(name, email, password, "", "", subscribeNewsletter);
        if (result?.success) setMode("login");
        else setError(result?.message || "Đăng ký thất bại.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#FDE2EB] flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* LEFT PANEL - Giới thiệu */}
        <div className="hidden md:flex flex-1 bg-[#f9d5df] flex-col items-center justify-center p-12 text-center">
          <div className="bg-white/40 p-6 rounded-full mb-6 backdrop-blur-sm">
            {/* Thay thế bằng Logo của bạn hoặc Icon tạm thời */}
            <img 
  src="/DDT-Photoroom.png" 
  alt="DDT Flower Logo" 
  className="w-32 h-auto object-contain" 
/>
          </div>
          <h2 className="text-4xl font-extrabold text-[#e06c7f] tracking-tight mb-4">
            DDT Flower Shop
          </h2>
          <p className="text-[#a46473] text-lg leading-relaxed max-w-xs">
            Nơi gửi gắm yêu thương qua từng bó hoa tươi thắm 💐
          </p>
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="flex-1 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {mode === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
            </h2>
            <p className="text-gray-500 mt-2">
              {mode === "login" ? "Vui lòng nhập thông tin để đăng nhập" : "Điền thông tin để bắt đầu trải nghiệm"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 border-l-4 border-red-500 rounded-r-xl mb-6 text-sm flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Họ tên</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f9d5df] focus:border-[#e06c7f] outline-none transition-all"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Email</label>
              <input
                type="email"
                required
                className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f9d5df] focus:border-[#e06c7f] outline-none transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full mt-1 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#f9d5df] focus:border-[#e06c7f] outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-[#e06c7f]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="text-right">
                <Link className="text-sm font-semibold text-[#e06c7f] hover:text-[#d35d75]">
                  Quên mật khẩu?
                </Link>
              </div>
            )}

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                loading ? "bg-gray-400" : "bg-[#e06c7f] hover:bg-[#d35d75] hover:shadow-pink-200"
              }`}
            >
              {loading ? "Đang xử lý..." : mode === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ NGAY"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative px-4 bg-white text-xs font-bold text-gray-400 uppercase">Hoặc dùng</span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleFacebookLogin}
              className="flex-1 border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-semibold text-gray-600"
            >
              <span className="text-blue-600 font-bold">f</span> Facebook
            </button>
            <button
              onClick={() => googleLoginCustom()}
              className="flex-1 border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-semibold text-gray-600"
            >
              <span className="text-red-500 font-bold">G</span> Google
            </button>
          </div>

          <p className="mt-10 text-center text-gray-500">
            {mode === "login" ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[#e06c7f] font-bold hover:underline ml-1"
            >
              {mode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;