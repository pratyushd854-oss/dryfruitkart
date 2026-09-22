import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  Package,
  ArrowRight,
  ShieldCheck,
  Truck,
  MapPin,
} from 'lucide-react';
import api from '../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch festive confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D0142C', '#D4AF37', '#0B0B0C', '#F1D77C'],
      });
    } catch (e) {
      // safe fallback
    }

    api
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center flex-1">
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-rcb-red text-white text-xs font-bold rounded-xl">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
      {/* Success Banner */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold text-rcb-gold uppercase tracking-wider bg-rcb-black px-3 py-1 rounded-full border border-rcb-gold/40">
          👑 Royal Order Confirmed
        </span>
        <h1 className="font-display text-2xl sm:text-4xl font-black text-gray-900 mt-2">
          Thank You For Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Order ID: <span className="font-mono font-bold text-gray-800">{order.id}</span>
        </p>
      </div>

      {/* Invoice Document Box (Printable) */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden print:border-none print:shadow-none mb-8">
        {/* Invoice Header */}
        <div className="bg-rcb-black text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-rcb-gold/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👑</span>
              <span className="font-display text-xl font-bold tracking-wider">
                DRYFRUIT<span className="text-rcb-red">KART</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Bangalore, Karnataka • GSTIN: 29AAACD1234F1Z5
            </p>
          </div>

          <div className="sm:text-right">
            <div className="text-xs text-rcb-lightGold font-semibold">TAX INVOICE</div>
            <div className="text-sm font-bold text-white mt-0.5">Date: {formatDate(order.createdAt)}</div>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
              Status: {order.status}
            </span>
          </div>
        </div>

        {/* Customer & Delivery Details */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Billed & Shipped To:
            </h4>
            <div className="text-xs text-gray-800 space-y-1">
              <p className="font-bold text-sm text-gray-900">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity} - {order.shippingPincode}</p>
              <p className="text-gray-500">Phone: {order.shippingPhone}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Payment Information:
            </h4>
            <div className="text-xs text-gray-800 space-y-1">
              <p>Method: <strong className="font-bold">{order.payment?.method}</strong></p>
              <p>
                Payment Status:{' '}
                <strong className={order.payment?.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>
                  {order.payment?.status}
                </strong>
              </p>
              {order.payment?.transactionId && (
                <p className="text-[11px] text-gray-500 font-mono">
                  Txn ID: {order.payment.transactionId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="p-6 sm:p-8">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Product Description</th>
                <th className="pb-3 text-center">Pack</th>
                <th className="pb-3 text-right">Unit Price</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-semibold text-gray-900">
                    {item.product?.name}
                  </td>
                  <td className="py-3 text-center text-gray-600">
                    {item.variantLabel}
                  </td>
                  <td className="py-3 text-right text-gray-600">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 text-right font-bold text-gray-900">
                    {formatCurrency(item.itemTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {order.discountAmount > 0 && (
                <tr className="text-emerald-600">
                  <td colSpan="3" className="pt-4 text-right font-medium">
                    Coupon Discount ({order.couponCode || 'PROMO'}):
                  </td>
                  <td className="pt-4 text-right font-bold">
                    - {formatCurrency(order.discountAmount)}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="pt-2 text-right text-gray-600">
                  Delivery Charges:
                </td>
                <td className="pt-2 text-right font-semibold text-gray-800">
                  FREE
                </td>
              </tr>
              <tr className="border-t-2 border-gray-200 text-sm">
                <td colSpan="3" className="pt-3 text-right font-black text-gray-900">
                  Total Paid:
                </td>
                <td className="pt-3 text-right font-black text-rcb-red text-base">
                  {formatCurrency(order.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
        <button
          onClick={handlePrintInvoice}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold shadow-sm transition flex items-center justify-center space-x-2"
        >
          <Printer className="w-4 h-4 text-gray-600" />
          <span>Print / Save Tax Invoice</span>
        </button>

        <Link
          to="/my-orders"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rcb-black hover:bg-gray-900 text-rcb-gold border border-rcb-gold text-xs font-bold shadow transition flex items-center justify-center space-x-2"
        >
          <Package className="w-4 h-4" />
          <span>Track in My Orders</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rcb-red hover:bg-rcb-deepRed text-white text-xs font-bold shadow-red transition flex items-center justify-center space-x-2"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
