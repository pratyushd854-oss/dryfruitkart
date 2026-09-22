import React, { useEffect, useState } from 'react';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/customers')
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900">
          Customer Directory
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Directory of registered retail buyers, purchase history, and lifetime spending.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-sm font-bold">No customers registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 uppercase font-semibold text-gray-500">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Details</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Completed Orders</th>
                  <th className="p-4">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4 font-bold text-gray-900 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-rcb-gold/20 text-rcb-goldMuted font-black flex items-center justify-center border border-rcb-gold/40">
                        {c.name ? c.name[0].toUpperCase() : 'U'}
                      </div>
                      <span>{c.name}</span>
                    </td>

                    <td className="p-4 text-gray-700 space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{c.email}</span>
                      </div>
                      {c.phone && (
                        <div className="flex items-center space-x-1.5 text-gray-500">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{c.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-gray-600">
                      {formatDate(c.joinedAt)}
                    </td>

                    <td className="p-4 font-bold text-gray-900">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                        {c.totalOrders} {c.totalOrders === 1 ? 'Order' : 'Orders'}
                      </span>
                    </td>

                    <td className="p-4 font-black text-rcb-red text-sm">
                      {formatCurrency(c.totalSpent)}
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

export default AdminCustomers;
