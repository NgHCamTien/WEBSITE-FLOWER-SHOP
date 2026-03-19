import React from 'react';
import { ShoppingCart, Search, Heart } from 'lucide-react';

const Home = () => {
  const flowers = [
    { id: 1, name: "Bó Hoa Hồng Red Charm", price: "850.000đ", image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500" },
    { id: 2, name: "Bó Hoa Hướng Dương Nắng", price: "450.000đ", image: "https://images.unsplash.com/photo-1597848212624-a19eb3bf93a9?w=500" },
    { id: 3, name: "Lẵng Hoa Khai Trương", price: "1.200.000đ", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500" }
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <nav style={styles.nav}>
        <h1 style={styles.logo}>FLOWER <span style={{color: '#ff4d6d'}}>SHOP</span></h1>
        <div style={styles.icons}>
          <Search size={24} style={{marginRight: '15px'}} />
          <ShoppingCart size={24} />
        </div>
      </nav>

      {/* Banner */}
      <div style={styles.banner}>
        <h2 style={{fontSize: '3rem'}}>Gửi Trao Yêu Thương</h2>
        <p>Ưu đãi 10% cho đơn hàng đầu tiên</p>
      </div>

      {/* Danh sách sản phẩm */}
      <div style={styles.productGrid}>
        {flowers.map(flower => (
          <div key={flower.id} style={styles.card}>
            <img src={flower.image} alt={flower.name} style={styles.img} />
            <h3 style={{fontSize: '1.1rem'}}>{flower.name}</h3>
            <p style={{color: '#ff4d6d', fontWeight: 'bold'}}>{flower.price}</p>
            <button style={styles.btn}>Thêm vào giỏ</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '20px 50px', alignItems: 'center', borderBottom: '1px solid #eee' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', margin: 0 },
  banner: { height: '300px', backgroundColor: '#fff0f3', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', padding: '50px' },
  card: { border: '1px solid #f0f0f0', borderRadius: '15px', padding: '15px', textAlign: 'center', transition: '0.3s' },
  img: { width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' },
  btn: { backgroundColor: '#ff4d6d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', marginTop: '10px' }
};

export default Home;