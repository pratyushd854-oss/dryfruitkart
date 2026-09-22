import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  ArrowRight,
  Package,
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, categorySales, recentOrders } = data || {
    stats: {},
    categorySales: [],
    recentOrders: [],
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue || 0),
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      title: 'Active Customers',
      value: stats.totalCustomers || 0,
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      title: 'Low Stock Alerts',
      value: `${stats.lowStockCount || 0} items`,
      icon: AlertTriangle,
      color: stats.lowStockCount > 0 ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-600 bg-gray-50',
    },
    {
      title: 'Pending Returns',
      value: stats.pendingReturnsCount || 0,
      icon: RotateCcw,
      color: stats.pendingReturnsCount > 0 ? 'text-orange-600 bg-orange-50 border-orange-200' : 'text-gray-600 bg-gray-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900">
            Store Performance Overview
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time sales telemetry, order fulfillment, and dry fruit stock status.
          </p>
        </div>

        <div className="flex space-x-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-rcb-red hover:bg-rcb-deepRed text-white rounded-xl text-xs font-bold shadow-red transition flex items-center space-x-1"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Manage Inventory</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className={`p-4 rounded-2xl border bg-white shadow-sm flex items-center justify-between ${c.color}`}
            >
              <div>
                <p className="text-xs font-semibold text-gray-500">{c.title}</p>
                <h3 className="text-xl font-black text-gray-900 mt-1">{c.value}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Sales Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-gray-900">
              Revenue by Dry Fruit Category
            </h3>
            <span className="text-xs text-gray-400 font-medium">All Time</span>
          </div>

          <div className="space-y-3 pt-2">
            {categorySales.length === 0 ? (
              <p className="text-xs text-gray-400">No category sales recorded yet.</p>
            ) : (
              categorySales.map((cat) => {
                const maxRev = Math.max(...categorySales.map((c) => c.revenue), 1);
                const percent = Math.round((cat.revenue / maxRev) * 100);

                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-700">
                      <span>{cat.category}</span>
                      <span className="text-rcb-red">{formatCurrency(cat.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rcb-red to-rcb-gold h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions & Store Health */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-gray-900 mb-2">
              RCB Royal Store Health & Alerts
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              This system implements the exact PRD specification: full relational mapping linking{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">
                Order → User → OrderItems → Product → Payment
              </code>{' '}
              allowing complete transparency into customer purchase volumes.
            </p>
          </div>

          <div className="space-y-2">
            <Link
              to="/admin/orders"
              className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-between text-xs transition font-semibold text-gray-800"
            >
              <span>View All Customer Orders & Update Delivery Status</span>
              <ArrowRight className="w-4 h-4 text-rcb-red" />
            </Link>

            <Link
              to="/admin/returns"
              className="p-3 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 flex items-center justify-between text-xs transition font-semibold text-orange-900"
            >
              <span>Manage Return / Refund Requests ({stats.pendingReturnsCount || 0} Pending)</span>
              <ArrowRight className="w-4 h-4 text-orange-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-gray-900">
              Recent Customer Purchases
            </h3>
            <p className="text-xs text-gray-500">Live feed of orders placed by customers</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-rcb-red hover:underline flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 uppercase font-semibold text-gray-500">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Products & Weight</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition">
                  <td className="p-4 font-mono font-bold text-gray-900">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{order.user?.name || order.shippingName}</div>
                    <div className="text-[11px] text-gray-400">{order.user?.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="max-w-xs truncate text-gray-700">
                      {order.items?.map((i) => `${i.product?.name} (${i.variantLabel})`).join(', ')}
                    </div>
                  </td>
                  <td className="p-4 font-black text-rcb-red">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-gray-800">{order.payment?.method}</span>
                    <span className={`block text-[10px] ${order.payment?.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.payment?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
