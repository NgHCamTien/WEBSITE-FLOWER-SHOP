import React from 'react';
import { Search, ShoppingCart, Heart } from 'lucide-react'; // Sử dụng icon giống mẫu

const HomePage = () => {
  // Dữ liệu mẫu cho sản phẩm
  const products = [
    { id: 1, name: "HOA HỒNG ĐỎ", price: "500.000đ", image: "https://via.placeholder.com/200" },
    { id: 2, name: "HOA HƯỚNG DƯƠNG", price: "350.000đ", image: "https://via.placeholder.com/200" },
    { id: 3, name: "HOA LY", price: "400.000đ", image: "https://via.placeholder.com/200" },
    { id: 4, name: "HOA LAN", price: "600.000đ", image: "https://via.placeholder.com/200" },
  ];

  return (
    <div style={styles.container}>
      {/* Header - Thanh điều hướng */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={{ color: '#000' }}>FLOWER</span>
          <span style={{ color: '#FF4D6D', fontWeight: 'bold' }}> SHOP</span>
        </div>
        <nav style={styles.nav}>
          {['TRANG CHỦ', 'SẢN PHẨM', 'DỊCH VỤ', 'TIN TỨC', 'LIÊN HỆ'].map(item => (
            <a href="#" key={item} style={styles.navLink}>{item}</a>
          ))}
        </nav>
        <div style={styles.headerIcons}>
          <Search size={20} style={styles.icon} />
          <Heart size={20} style={styles.icon} />
          <div style={styles.cartIcon}>
            <ShoppingCart size={20} />
            <span style={styles.cartBadge}>0</span>
          </div>
        </div>
      </header>

      {/* Banner - Vùng ảnh chính */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <h1 style={styles.bannerTitle}>Trao gửi yêu thương,<br /> vẹn nguyên <span style={{color: '#FF4D6D'}}>từng khoảnh khắc</span></h1>
          <button style={styles.bannerBtn}>MUA NGAY</button>
        </div>
        <div style={styles.bannerImagePlaceholder}>
          {/* Thay thế bằng ảnh thật từ assets */}
          <img src="https://via.placeholder.com/400x500" alt="Banner" style={{ borderRadius: '20px' }} />
        </div>
      </section>

      {/* Categories - Danh mục */}
      <section style={styles.categories}>
        {['HOA CHÚC MỪNG', 'HOA CƯỚI', 'HOA CHIA BUỒN'].map(category => (
          <div key={category} style={styles.categoryCard}>
            <div style={styles.categoryCircle}>
               {/* Thay thế bằng ảnh thật */}
               <img src="https://via.placeholder.com/100" alt={category} style={{ borderRadius: '50%' }} />
            </div>
            <p style={styles.categoryName}>{category}</p>
          </div>
        ))}
      </section>

      {/* Product List - Danh sách sản phẩm */}
      <section style={styles.productList}>
        <h2 style={styles.sectionTitle}>SẢN PHẨM BÁN CHẠY</h2>
        <div style={styles.productGrid}>
          {products.map(product => (
            <div key={product.id} style={styles.productCard}>
              <img src={product.image} alt={product.name} style={styles.productImg} />
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productPrice}>{product.price}</p>
              <button style={styles.productBtn}>THÊM VÀO GIỎ</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Styles cơ bản (bạn nên đưa vào file CSS)
const styles = {
  container: { fontFamily: 'Arial, sans-serif', color: '#333' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 50px', backgroundColor: '#fff', borderBottom: '1px solid #eee' },
  logo: { fontSize: '1.4rem', fontWeight: 'bold' },
  nav: { display: 'flex', gap: '20px' },
  navLink: { textDecoration: 'none', color: '#000', fontWeight: '500', fontSize: '0.9rem' },
  headerIcons: { display: 'flex', gap: '15px', alignItems: 'center' },
  icon: { cursor: 'pointer', color: '#000' },
  cartIcon: { position: 'relative', cursor: 'pointer', color: '#000' },
  cartBadge: { position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#FF4D6D', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '0.7rem' },
  banner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '50px', backgroundColor: '#FDF2F2', borderRadius: '20px', margin: '20px' },
  bannerContent: { flex: 1 },
  bannerTitle: { fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1.3' },
  bannerBtn: { backgroundColor: '#FF4D6D', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '25px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' },
  bannerImagePlaceholder: { flex: 1, textAlign: 'right' },
  categories: { display: 'flex', justifyContent: 'center', gap: '50px', padding: '50px' },
  categoryCard: { textAlign: 'center' },
  categoryCircle: { width: '120px', height: '120px', borderRadius: '50%', border: '2px solid #FF4D6D', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  categoryName: { marginTop: '10px', fontWeight: 'bold' },
  productList: { padding: '50px' },
  sectionTitle: { textAlign: 'center', fontSize: '2rem', marginBottom: '30px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' },
  productCard: { border: '1px solid #eee', borderRadius: '15px', padding: '15px', textAlign: 'center' },
  productImg: { width: '100%', borderRadius: '10px', marginBottom: '10px' },
  productName: { fontSize: '1.1rem', marginBottom: '5px' },
  productPrice: { color: '#FF4D6D', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' },
  productBtn: { backgroundColor: '#FF4D6D', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer' },
};

export default HomePage;