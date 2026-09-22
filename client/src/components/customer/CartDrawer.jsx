import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const CartDrawer = () => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setCouponSuccess('');

    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  // Free shipping calculation (threshold ₹999)
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-rcb-black text-white p-4 flex items-center justify-between border-b border-rcb-gold/40">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-rcb-gold" />
              <h2 className="font-display font-bold text-lg">Your Royal Cart</h2>
              <span className="bg-rcb-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5">
            <div className="flex items-center justify-between text-xs text-amber-900 font-medium mb-1">
              <span className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-rcb-red" />
                <span>
                  {remainingForFreeShipping > 0
                    ? `Add ${formatCurrency(remainingForFreeShipping)} more for FREE Delivery!`
                    : '🎉 Congratulations! You unlocked FREE Delivery!'}
                </span>
              </span>
              <span className="font-bold">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-amber-200/70 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rcb-red h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-gray-800 text-base">Your Cart is Empty</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Discover our royal harvest of Mamra almonds, cashew nuts, and king dates.
                </p>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-4 px-4 py-2 bg-rcb-red text-white text-xs font-bold rounded-xl shadow hover:bg-rcb-deepRed transition"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantLabel}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <img
                    src={item.product?.imageUrl}
                    alt={item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-200"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {item.product?.name}
                    </h4>
                    <span className="inline-block text-[11px] bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium mt-0.5">
                      Pack: {item.variantLabel}
                    </span>
                    <div className="text-xs font-bold text-rcb-red mt-1">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => removeFromCart(item.productId, item.variantLabel)}
                      className="text-gray-400 hover:text-red-600 p-1 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center space-x-1.5 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantLabel, -1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1 min-w-[16px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantLabel, 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-gray-900">
                      {formatCurrency(item.itemTotal)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon & Summary Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50/80 space-y-3">
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{coupon.code}</strong> applied ({coupon.discountPercent}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon (e.g. RCB2026)"
                      className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:border-rcb-red outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-rcb-black hover:bg-gray-800 text-rcb-gold border border-rcb-gold text-xs font-bold px-3 py-2 rounded-lg transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-600 uppercase text-[11px]">FREE</strong>
                    ) : (
                      formatCurrency(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-900 border-t border-gray-300 pt-2">
                  <span>Total Amount</span>
                  <span className="text-rcb-red text-base">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white text-xs font-bold shadow-red hover:brightness-110 transition flex items-center justify-center space-x-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
