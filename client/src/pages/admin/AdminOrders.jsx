import React, { useEffect, useState } from 'react';
import { Search, Filter, CheckCircle2, RotateCcw, Truck, FileText } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.append('status', statusFilter);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    api
      .get(`/admin/orders?${params.toString()}`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900">
          Customer Orders Management
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Real-time ledger: see who bought what, package weights, amount, transaction timestamp, and change fulfillment status.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by buyer, email, or order ID..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
          />
        </form>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1">
          {['ALL', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'RETURNED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
                statusFilter === st
                  ? 'bg-rcb-black text-rcb-gold border-rcb-gold'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-sm font-bold">No orders found matching filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 uppercase font-semibold text-gray-500">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Products & Weight</th>
                  <th className="p-4">Shipping Destination</th>
                  <th className="p-4">Total & Payment</th>
                  <th className="p-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition">
                    {/* Order ID & Date */}
                    <td className="p-4 align-top">
                      <div className="font-mono font-bold text-gray-900">
                        {order.id.slice(0, 8)}...
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-gray-900">{order.shippingName}</div>
                      <div className="text-[11px] text-gray-500">{order.user?.email}</div>
                      <div className="text-[11px] text-gray-400">{order.shippingPhone}</div>
                    </td>

                    {/* Products & Weight */}
                    <td className="p-4 align-top">
                      <div className="space-y-1 max-w-xs">
                        {order.items?.map((item) => (
                          <div key={item.id} className="text-gray-800">
                            • <strong className="font-semibold">{item.product?.name}</strong>{' '}
                            <span className="text-gray-500">({item.variantLabel})</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Address */}
                    <td className="p-4 align-top max-w-xs">
                      <div className="text-gray-700">{order.shippingAddress}</div>
                      <div className="text-[11px] text-gray-500">{order.shippingCity} - {order.shippingPincode}</div>
                    </td>

                    {/* Amount & Payment */}
                    <td className="p-4 align-top">
                      <div className="text-sm font-black text-rcb-red">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-[11px] font-semibold text-gray-700 mt-0.5">
                        {order.payment?.method} (
                        <span className={order.payment?.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}>
                          {order.payment?.status}
                        </span>
                        )
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4 align-top">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border outline-none cursor-pointer ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="RETURNED">RETURNED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
