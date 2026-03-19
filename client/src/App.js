import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header" style={{ backgroundColor: '#fff5f5', color: '#d63384' }}>
        <h1>🌹 WEBSITE ĐẶT ĐIỆN HOA & QUÀ TẶNG 🎁</h1>
        <p style={{ color: '#555' }}>Chào mừng nhóm trưởng Cẩm Tiên quay trở lại dự án!</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button style={btnStyle}>Danh mục hoa</button>
          <button style={btnStyle}>Giỏ hàng</button>
          <button style={btnStyle}>Quản trị</button>
        </div>
      </header>
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  backgroundColor: '#d63384',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default App;