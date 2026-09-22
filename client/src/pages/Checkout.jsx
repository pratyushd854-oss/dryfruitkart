import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, discount, deliveryFee, grandTotal, coupon, clearCart } = useCart();
  const navigate = useNavigate();

  // Shipping Form State
  const [formData, setFormData] = useState({
    shippingName: user?.name || '',
    shippingPhone: user?.phone || '',
    shippingAddress: user?.addresses?.[0]?.street || '',
    shippingCity: user?.addresses?.[0]?.city || 'Bengaluru',
    shippingPincode: user?.addresses?.[0]?.pincode || '560001',
    paymentMethod: 'UPI', // UPI, CARD, NETBANKING, COD
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Payment Modal Simulation States
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center flex-1">
        <h2 className="text-xl font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mt-1">Please add items to your cart before checking out.</p>
        <Link to="/shop" className="mt-4 inline-block px-4 py-2 bg-rcb-red text-white text-xs font-bold rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.shippingName || !formData.shippingAddress || !formData.shippingCity || !formData.shippingPincode) {
      setError('Please fill in all shipping details.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    // If UPI selected, trigger interactive QR simulation modal
    if (formData.paymentMethod === 'UPI') {
      setShowUpiModal(true);
      return;
    }

    // Execute direct order placement for CARD / COD / NETBANKING
    await submitOrder();
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantLabel: item.variantLabel,
          weightKg: item.weightKg,
          quantity: item.quantity,
        })),
        shippingName: formData.shippingName,
        shippingPhone: formData.shippingPhone,
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingPincode: formData.shippingPincode,
        paymentMethod: formData.paymentMethod,
        couponCode: coupon?.code || null,
      };

      const res = await api.post('/orders', payload);
      const createdOrder = res.data.order;

      clearCart();
      setShowUpiModal(false);
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateUpiSuccess = async () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      await submitOrder();
      setIsProcessingPayment(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-black text-gray-900">Secure Checkout</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Complete your order with verified 256-bit SSL encrypted payment.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-display font-bold text-base text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-rcb-red text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="shippingName"
                  value={formData.shippingName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Virat Sharma"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="shippingPhone"
                  value={formData.shippingPhone}
                  onChange={handleChange}
                  required
                  placeholder="+91 98801 23456"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Delivery Street Address *</label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  placeholder="House/Flat No., Apartment, Street, Landmark"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  required
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  name="shippingPincode"
                  value={formData.shippingPincode}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 560001"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-display font-bold text-base text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-rcb-red text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Payment Option</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* UPI Option */}
              <label
                className={`p-4 rounded-xl border-2 flex items-center space-x-3 cursor-pointer transition ${
                  formData.paymentMethod === 'UPI'
                    ? 'border-rcb-gold bg-amber-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={formData.paymentMethod === 'UPI'}
                  onChange={handleChange}
                  className="accent-rcb-red"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-gray-900">Instant UPI / QR Code</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </label>

              {/* Card Option */}
              <label
                className={`p-4 rounded-xl border-2 flex items-center space-x-3 cursor-pointer transition ${
                  formData.paymentMethod === 'CARD'
                    ? 'border-rcb-gold bg-amber-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={formData.paymentMethod === 'CARD'}
                  onChange={handleChange}
                  className="accent-rcb-red"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-gray-900">Credit / Debit Card</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Visa, Mastercard, RuPay</p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-xl border-2 flex items-center space-x-3 cursor-pointer transition ${
                  formData.paymentMethod === 'COD'
                    ? 'border-rcb-gold bg-amber-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="accent-rcb-red"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-gray-900">Cash on Delivery</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Pay upon package arrival</p>
                </div>
              </label>

              {/* Net Banking */}
              <label
                className={`p-4 rounded-xl border-2 flex items-center space-x-3 cursor-pointer transition ${
                  formData.paymentMethod === 'NETBANKING'
                    ? 'border-rcb-gold bg-amber-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="NETBANKING"
                  checked={formData.paymentMethod === 'NETBANKING'}
                  onChange={handleChange}
                  className="accent-rcb-red"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-gray-900">Net Banking</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">All major Indian banks</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-gray-900 border-b border-gray-100 pb-3">
              Order Items ({items.length})
            </h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantLabel}`} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-800 line-clamp-1">{item.product?.name}</div>
                    <div className="text-[11px] text-gray-500">
                      {item.variantLabel} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">
                    {formatCurrency(item.itemTotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 uppercase text-[11px]">FREE</strong> : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-black text-gray-900">
                <span>Total Payable</span>
                <span className="text-rcb-red text-xl">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white font-bold text-sm shadow-red hover:brightness-110 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-rcb-gold" />
                  <span>
                    {formData.paymentMethod === 'UPI' ? 'Pay with UPI QR' : 'Confirm & Place Order'}
                  </span>
                </>
              )}
            </button>

            <div className="text-[11px] text-gray-400 text-center flex items-center justify-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>PCI-DSS Compliant & Academic Capstone Demo Safe</span>
            </div>
          </div>
        </div>
      </form>

      {/* UPI QR Code Simulator Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rcb-gold text-center relative">
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="font-display font-black text-lg text-gray-900">Scan UPI QR to Pay</h3>
            <p className="text-xs text-gray-500 mt-1">
              Amount Payable: <strong className="text-rcb-red text-sm font-black">{formatCurrency(grandTotal)}</strong>
            </p>

            {/* Generated QR visual */}
            <div className="my-5 p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=dryfruitkart@bank&pn=DryFruitKart&am=${grandTotal}&cu=INR`}
                alt="UPI QR Code"
                className="w-44 h-44 mx-auto rounded-lg"
              />
              <div className="text-[10px] text-gray-500 font-mono mt-2">
                UPI ID: dryfruitkart@okhdfcbank
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSimulateUpiSuccess}
                disabled={isProcessingPayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-1.5"
              >
                {isProcessingPayment ? (
                  <span>Verifying Payment...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful UPI Payment</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowUpiModal(false)}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 font-semibold"
              >
                Cancel / Choose Another Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
