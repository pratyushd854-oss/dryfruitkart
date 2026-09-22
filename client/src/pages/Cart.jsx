import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const Cart = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponMessage('');

    const res = await applyCoupon(couponCode.trim());
    setIsSuccess(res.success);
    setCouponMessage(res.message);
    if (res.success) setCouponCode('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center flex-1">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
          You have not added any dry fruits to your cart yet. Explore our royal harvest and pick your favourites!
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-rcb-red hover:bg-rcb-deepRed text-white text-xs font-bold rounded-xl shadow-red transition"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-black text-gray-900">Shopping Cart</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review your dry fruit selection before proceeding to checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantLabel}`}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-rcb-red uppercase tracking-wider">
                        {item.product?.category}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug">
                        {item.product?.name}
                      </h3>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Pack Variant:{' '}
                        <span className="font-semibold text-gray-800">
                          {item.variantLabel}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-rcb-red sm:hidden mt-1">
                        {formatCurrency(item.price)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                    {/* Unit Price */}
                    <div className="hidden sm:block text-right">
                      <div className="text-[11px] text-gray-400">Unit Price</div>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatCurrency(item.price)}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.variantLabel, -1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.variantLabel, 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-[80px]">
                      <div className="text-[11px] text-gray-400 sm:hidden">Total</div>
                      <div className="text-base font-black text-gray-900">
                        {formatCurrency(item.itemTotal)}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.variantLabel)
                      }
                      className="text-gray-400 hover:text-red-600 transition p-1"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Note */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-center space-x-3 text-xs text-amber-900">
            <Truck className="w-5 h-5 text-rcb-red shrink-0" />
            <div>
              <span className="font-bold">Fresh Nitrogen Pack Guarantee:</span> All items are packed in hermetically sealed food-grade zip pouches immediately prior to dispatch to preserve supreme freshness.
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-600 uppercase text-[11px]">
                      FREE
                    </strong>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-black text-gray-900">
                <span>Grand Total</span>
                <span className="text-rcb-red text-xl">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="text-[11px] text-gray-400 text-right">
                Inclusive of all applicable GST taxes
              </div>
            </div>

            {/* Coupon Application */}
            <div className="pt-2 border-t border-gray-100">
              {coupon ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-800 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{coupon.code} Applied</span>
                    </span>
                    <span className="text-[11px] text-emerald-600">
                      Saved {coupon.discountPercent}% ({formatCurrency(discount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon Code"
                        className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-rcb-black hover:bg-gray-800 text-rcb-gold border border-rcb-gold px-4 py-2 rounded-xl text-xs font-bold transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-[11px] font-medium ${
                        isSuccess ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {couponMessage}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400">
                    💡 Try promo code: <code className="font-bold text-rcb-red">RCB2026</code> (18% OFF)
                  </p>
                </form>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white font-bold text-sm shadow-red hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
