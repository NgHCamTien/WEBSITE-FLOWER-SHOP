import React from 'react';
import { Search, ShoppingCart, Heart, ArrowRight, Facebook, Instagram, Phone } from 'lucide-react';

const HomePage = () => {
  // Dữ liệu mẫu để hiển thị (Sau này bạn C sẽ đổ từ Database vào đây)
  const trendingFlowers = [
    { id: 1, name: "Bó Hồng Juliet", price: "550.000đ", img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=500" },
    { id: 2, name: "Hướng Dương Tỏa Nắng", price: "420.000đ", img: "https://images.unsplash.com/photo-1597848212624-a19eb3bf93a9?w=500" },
    { id: 3, name: "Lẵng Tulip Hà Lan", price: "890.000đ", img: "https://images.unsplash.com/photo-1520323232427-6b620010513f?w=500" },
    { id: 4, name: "Cẩm Tú Cầu Đà Lạt", price: "600.000đ", img: "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?w=500" },
  ];

  return (
    <div style={styles.container}>
      {/* --- PHẦN 1: HERO BANNER (Vùng ấn tượng đầu tiên) --- */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Trao gửi <span style={{color: '#FF4D6D'}}>yêu thương</span>, <br />
            vẹn nguyên từng khoảnh khắc
          </h1>
          <p style={styles.heroSub}>Hương hoa thay lời muốn nói, gửi gắm tâm tình đến người thân yêu của bạn.</p>
          <button style={styles.btnPrimary}>MUA NGAY <ArrowRight size={18} /></button>
        </div>
        <div style={styles.heroImageContainer}>
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800" alt="Banner" style={styles.heroImg} />
        </div>
      </section>

      {/* --- PHẦN 2: DANH MỤC TRÒN (Bám sát mẫu bạn gửi) --- */}
      <section style={styles.catSection}>
        <div style={styles.catGrid}>
          {[
            { label: 'HOA CHÚC MỪNG', icon: '💐' },
            { label: 'HOA CƯỚI', icon: '💍' },
            { label: 'HOA CHIA BUỒN', icon: '🕯️' }
          ].map((item, index) => (
            <div key={index} style={styles.catCard}>
              <div style={styles.catCircle}>{item.icon}</div>
              <div style={styles.catBox}>
                <p style={styles.catLabel}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PHẦN 3: SẢN PHẨM NỔI BẬT --- */}
      <section style={styles.productSection}>
        <h2 style={styles.sectionTitle}>Sản Phẩm Bán Chạy</h2>
        <div style={styles.productGrid}>
          {trendingFlowers.map(flower => (
            <div key={flower.id} style={styles.flowerCard}>
              <div style={styles.imgWrap}>
                <img src={flower.img} alt={flower.name} style={styles.flowerImg} />
                <div style={styles.heartIcon}><Heart size={18} color="#FF4D6D" /></div>
              </div>
              <h3 style={styles.flowerName}>{flower.name}</h3>
              <p style={styles.flowerPrice}>{flower.price}</p>
              <button style={styles.addCartBtn}>Thêm vào giỏ</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- HỆ THỐNG STYLES (Đảm bảo tính thẩm mỹ cao) ---
const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, sans-serif", color: '#333' },
  heroSection: { display: 'flex', alignItems: 'center', backgroundColor: '#FFF0F3', margin: '20px 50px', borderRadius: '40px', padding: '60px' },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: '3.2rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px' },
  heroSub: { fontSize: '1.1rem', color: '#666', marginBottom: '30px', maxWidth: '450px' },
  btnPrimary: { display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FF4D6D', color: '#fff', border: 'none', padding: '15px 35px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' },
  heroImageContainer: { flex: 1, textAlign: 'right' },
  heroImg: { width: '90%', borderRadius: '30px' },

  catSection: { padding: '80px 0' },
  catGrid: { display: 'flex', justifyContent: 'center', gap: '60px' },
  catCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px' },
  catCircle: { width: '120px', height: '120px', borderRadius: '50%', border: '3px solid #FF4D6D', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px', zIndex: 2, marginBottom: '-30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' },
  catBox: { width: '100%', padding: '50px 20px 20px', border: '1px solid #FFB7C5', borderRadius: '20px', textAlign: 'center' },
  catLabel: { fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' },

  productSection: { padding: '0 80px 80px' },
  sectionTitle: { textAlign: 'center', fontSize: '2.5rem', marginBottom: '50px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' },
  flowerCard: { textAlign: 'center' },
  imgWrap: { position: 'relative', overflow: 'hidden', borderRadius: '20px', marginBottom: '15px' },
  flowerImg: { width: '100%', height: '300px', objectFit: 'cover' },
  heartIcon: { position: 'absolute', top: '15px', right: '15px', backgroundColor: '#fff', padding: '8px', borderRadius: '50%' },
  flowerName: { fontSize: '1.2rem', fontWeight: 'bold' },
  flowerPrice: { color: '#FF4D6D', fontWeight: 'bold', margin: '10px 0', fontSize: '1.1rem' },
  addCartBtn: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #FF4D6D', color: '#FF4D6D', backgroundColor: 'transparent', fontWeight: 'bold', cursor: 'pointer' }
};

export default HomePage;