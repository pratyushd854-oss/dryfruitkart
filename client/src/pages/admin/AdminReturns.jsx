import React, { useEffect, useState } from 'react';
import { RotateCcw, CheckCircle, XCircle, DollarSign, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNotes, setActiveNotes] = useState({});

  const fetchReturns = () => {
    setLoading(true);
    api
      .get('/admin/returns')
      .then((res) => setReturns(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const note = activeNotes[id] || undefined;
      await api.put(`/admin/returns/${id}`, { status, adminNotes: note });
      fetchReturns();
    } catch (err) {
      alert('Failed to update return status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900">
          Returns & Refund Claims
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Process customer return requests, review reported quality/transit issues, and execute refunds.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
          </div>
        ) : returns.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-sm font-bold">No return or refund requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {returns.map((ret) => (
              <div key={ret.id} className="p-6 space-y-4 hover:bg-gray-50/50 transition">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-gray-900">
                      Order: {ret.orderId.slice(0, 8)}...
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{formatDate(ret.createdAt)}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs border ${getStatusColor(
                      ret.status
                    )}`}
                  >
                    ● Status: {ret.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                      Customer
                    </h4>
                    <p className="font-bold text-gray-900">{ret.user?.name}</p>
                    <p className="text-gray-500">{ret.user?.email}</p>
                    <p className="text-gray-500">{ret.user?.phone}</p>
                  </div>

                  {/* Return Reason */}
                  <div className="md:col-span-2 bg-orange-50/60 border border-orange-200/80 p-3 rounded-xl">
                    <h4 className="font-bold text-orange-950 uppercase tracking-wider text-[10px] mb-1">
                      Reason Stated by Buyer:
                    </h4>
                    <p className="text-orange-900 font-medium leading-relaxed">
                      "{ret.reason}"
                    </p>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                  <span className="text-gray-500 font-semibold block mb-1">
                    Purchased Dry Fruits in this Order (Total: {formatCurrency(ret.order?.totalAmount)}):
                  </span>
                  <div className="space-y-0.5">
                    {ret.order?.items?.map((i) => (
                      <div key={i.id} className="text-gray-800">
                        • {i.product?.name} ({i.variantLabel}) - {formatCurrency(i.itemTotal)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex-1 max-w-sm">
                    <input
                      type="text"
                      placeholder="Add review note (e.g. Courier verified, refund approved)..."
                      value={activeNotes[ret.id] !== undefined ? activeNotes[ret.id] : ret.adminNotes || ''}
                      onChange={(e) =>
                        setActiveNotes({ ...activeNotes, [ret.id]: e.target.value })
                      }
                      className="w-full text-xs p-2 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    {ret.status === 'REQUESTED' && (
                      <>
                        <button
                          onClick={() => handleAction(ret.id, 'APPROVED')}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve Return</span>
                        </button>

                        <button
                          onClick={() => handleAction(ret.id, 'REJECTED')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {ret.status !== 'REFUNDED' && (
                      <button
                        onClick={() => handleAction(ret.id, 'REFUNDED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Process 100% Refund</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReturns;
