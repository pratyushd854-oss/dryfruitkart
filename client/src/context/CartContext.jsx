import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('dryfruitkart_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('dryfruitkart_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dryfruitkart_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('dryfruitkart_coupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('dryfruitkart_coupon');
    }
  }, [coupon]);

  const addToCart = (product, variantLabel = '500g', weightKg = 0.5, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantLabel === variantLabel
      );

      const unitPrice = Math.round(product.pricePerKg * weightKg);

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * unitPrice,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            variantLabel,
            weightKg,
            quantity,
            price: unitPrice,
            itemTotal: quantity * unitPrice,
          },
        ];
      }
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId, variantLabel, delta) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId && item.variantLabel === variantLabel) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              itemTotal: newQty * item.price,
            };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId, variantLabel) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantLabel === variantLabel)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', {
        code,
        cartTotal: subtotal,
      });
      setCoupon(res.data.coupon);
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid coupon code.',
      };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal > 0) {
    const rawDiscount = (subtotal * coupon.discountPercent) / 100;
    discount = Math.min(rawDiscount, coupon.maxDiscount || 500);
  }

  // Free shipping on orders above 999
  const deliveryFee = subtotal > 999 || subtotal === 0 ? 0 : 70;
  const grandTotal = Math.max(0, Math.round(subtotal - discount + deliveryFee));

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        subtotal,
        discount,
        deliveryFee,
        grandTotal,
        coupon,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
