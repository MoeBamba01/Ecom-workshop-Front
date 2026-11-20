"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // cart = [{ _id, name, price, image, stock, quantity }]
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  function updateCart(newCart) {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function addToCart(product, quantity = 1) {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      updateQuantity(product._id, exists.quantity + quantity);
    } else {
      updateCart([...cart, { ...product, quantity }]);
    }
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) return removeFromCart(id);
    updateCart(cart.map((item) => (item._id === id ? { ...item, quantity } : item)));
  }

  function removeFromCart(id) {
    updateCart(cart.filter((item) => item._id !== id));
  }

  function clearCart() {
    updateCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
