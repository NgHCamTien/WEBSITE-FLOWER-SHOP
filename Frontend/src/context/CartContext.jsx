import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load giỏ hàng từ LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('ddt_cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Lưu giỏ hàng mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('ddt_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const isExist = prev.find((item) => item._id === product._id);
      if (isExist) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  // --- HÀM TĂNG GIẢM SỐ LƯỢNG (TIÊN KIỂM TRA CHỖ NÀY) ---
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return; // Không cho giảm xuống 0
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      updateQuantity, // PHẢI CÓ DÒNG NÀY Ở ĐÂY THÌ BÊN NGOÀI MỚI DÙNG ĐƯỢC
      removeFromCart, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};