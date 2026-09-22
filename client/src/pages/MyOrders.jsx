import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  RotateCcw,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import api from '../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return Modal State
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnSubmitting, setReturnSubmitting] = useState(false);
  const [returnMessage, setReturnMessage] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    api
      .get('/orders/my-orders')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenReturnModal = (order) => {
    setSelectedOrderForReturn(order);
    setReturnReason('');
    setReturnMessage('');
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!returnReason.trim()) return;

    setReturnSubmitting(true);
    setReturnMessage('');

    try {
      await api.post('/returns', {
        orderId: selectedOrderForReturn.id,
        reason: returnReason.trim(),
      });
      setReturnMessage('Return request submitted successfully! Our team will inspect it.');
      setTimeout(() => {
        setSelectedOrderForReturn(null);
        fetchOrders();
      }, 1500);
    } catch (err) {
      setReturnMessage(err.response?.data?.message || 'Failed to submit return request.');
    } finally {
      setReturnSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
        <div>
          <h1 className="font-display text-3xl font-black text-gray-900">My Orders</h1>
          <p className="text-xs text-gray-500 mt-1">
            Track live dispatch status, download invoices, and request returns.
          </p>
        </div>
        <Link
          to="/shop"
          className="px-4 py-2 bg-rcb-black text-rcb-gold border border-rcb-gold rounded-xl text-xs font-bold hover:bg-gray-800 transition"
        >
          Explore More Dry Fruits
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">No Orders Yet</h3>
          <p className="text-xs text-gray-500 mt-1">
            You have not placed any orders yet. Try our Royal California Almonds or W240 Cashews!
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-block px-5 py-2.5 bg-rcb-red text-white text-xs font-bold rounded-xl shadow-red"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const steps = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
            const currentStepIdx = steps.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Order ID</span>
                      <span className="font-mono font-bold text-gray-900">{order.id.slice(0, 13)}...</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Date</span>
                      <span className="font-semibold text-gray-700">{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Total</span>
                      <span className="font-black text-rcb-red">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full font-bold text-xs border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      ● {order.status}
                    </span>

                    <Link
                      to={`/order-success/${order.id}`}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-white text-gray-600 transition"
                      title="View Invoice"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Timeline Stepper (if not cancelled/returned) */}
                {order.status !== 'CANCELLED' && order.status !== 'RETURNED' && (
                  <div className="px-6 pt-5 pb-3 border-b border-gray-100 bg-white">
                    <div className="flex items-center justify-between relative max-w-xl mx-auto">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-rcb-red -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${Math.max(0, (currentStepIdx / (steps.length - 1)) * 100)}%`,
                        }}
                      />

                      {steps.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div key={step} className="flex flex-col items-center relative z-10">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-rcb-red text-white shadow-md'
                                  : 'bg-gray-100 text-gray-400 border border-gray-300'
                              } ${isCurrent ? 'ring-4 ring-red-100' : ''}`}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${
                                isDone ? 'text-gray-900' : 'text-gray-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Return Request Banner (if any) */}
                {order.returnRequest && (
                  <div className="mx-6 my-3 p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-orange-900">
                      <RotateCcw className="w-4 h-4 text-orange-600 shrink-0" />
                      <div>
                        <span className="font-bold">Return Request Status: </span>
                        <span className="uppercase font-extrabold text-orange-700">
                          {order.returnRequest.status}
                        </span>
                        <p className="text-[11px] text-orange-800 mt-0.5">
                          Reason: "{order.returnRequest.reason}"
                        </p>
                      </div>
                    </div>
                    {order.returnRequest.adminNotes && (
                      <div className="text-[11px] text-gray-500 italic max-w-xs">
                        Admin Note: {order.returnRequest.adminNotes}
                      </div>
                    )}
                  </div>
                )}

                {/* Items in this order */}
                <div className="p-6 divide-y divide-gray-100">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product?.imageUrl}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">{item.product?.name}</h4>
                          <span className="text-gray-500">
                            Pack: {item.variantLabel}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          {formatCurrency(item.price)}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Total: {formatCurrency(item.itemTotal)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Actions Footer */}
                <div className="bg-gray-50/70 px-6 py-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-gray-500">
                    Payment: <strong className="text-gray-800">{order.payment?.method}</strong> ({order.payment?.status})
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Return button: allow if DELIVERED and no existing returnRequest */}
                    {!order.returnRequest && order.status === 'DELIVERED' && (
                      <button
                        onClick={() => handleOpenReturnModal(order)}
                        className="text-xs font-semibold text-rcb-red hover:underline flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request Return / Refund</span>
                      </button>
                    )}

                    <Link
                      to={`/order-success/${order.id}`}
                      className="text-xs font-bold text-gray-800 hover:text-rcb-red flex items-center space-x-1"
                    >
                      <span>Invoice & Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Return Request Modal */}
      {selectedOrderForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-rcb-gold relative">
            <button
              onClick={() => setSelectedOrderForReturn(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="font-display font-black text-lg text-gray-900 text-center">
              Request Return or Refund
            </h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              Order ID: <span className="font-mono font-bold text-gray-800">{selectedOrderForReturn.id}</span>
            </p>

            <form onSubmit={handleSubmitReturn} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reason for Return / Refund *
                </label>
                <textarea
                  rows="3"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  required
                  placeholder="e.g. Courier packaging damaged, quality or freshness concern..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-rcb-red outline-none resize-none"
                />
              </div>

              {returnMessage && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs font-medium">
                  {returnMessage}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForReturn(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={returnSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-rcb-red hover:bg-rcb-deepRed text-white font-bold transition shadow-red"
                >
                  {returnSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
