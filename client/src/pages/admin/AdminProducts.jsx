import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, AlertTriangle, Check, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Almonds',
    pricePerKg: '',
    stockKg: '',
    imageUrl: '',
    description: '',
    origin: '',
    healthBenefits: '',
    isFeatured: false,
  });

  const fetchProducts = () => {
    setLoading(true);
    api
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Almonds',
      pricePerKg: '',
      stockKg: '25',
      imageUrl: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
      description: 'Supreme quality hand-picked whole dry fruits.',
      origin: 'Kashmir Valley',
      healthBenefits: 'Rich in vital minerals and natural antioxidants.',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      pricePerKg: product.pricePerKg,
      stockKg: product.stockKg,
      imageUrl: product.imageUrl,
      description: product.description,
      origin: product.origin,
      healthBenefits: product.healthBenefits,
      isFeatured: product.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
      } else {
        await api.post('/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dry fruit item?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-gray-900">
            Products & Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage dry fruit catalog, pricing per kg, and monitor warehouse stock levels.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-rcb-red hover:bg-rcb-deepRed text-white rounded-xl text-xs font-bold shadow-red transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dry Fruit</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog by name or category..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
          />
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Total Items: <strong className="text-gray-900">{products.length}</strong>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 uppercase font-semibold text-gray-500">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price / Kg</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Origin</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-xl border border-gray-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-gray-900 flex items-center space-x-1">
                          <span>{p.name}</span>
                          {p.isFeatured && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                          {p.description}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-gray-700">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4 font-black text-rcb-red text-sm">
                      {formatCurrency(p.pricePerKg)}
                    </td>

                    <td className="p-4">
                      {p.stockKg <= 5 ? (
                        <span className="inline-flex items-center space-x-1 text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{p.stockKg} kg (Low Stock)</span>
                        </span>
                      ) : (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                          {p.stockKg} kg
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-gray-600">{p.origin}</td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-rcb-gold relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold"
            >
              ✕
            </button>

            <h3 className="font-display font-black text-lg text-gray-900 mb-4">
              {editingProduct ? 'Edit Dry Fruit' : 'Add New Dry Fruit'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Afghan Figs"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none bg-white font-medium"
                  >
                    {['Almonds', 'Cashews', 'Pistachios', 'Walnuts', 'Dates', 'Raisins', 'Exotic', 'Hampers'].map(
                      (c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price / Kg (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.pricePerKg}
                    onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
                    placeholder="e.g. 1400"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock in Kg *</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    value={formData.stockKg}
                    onChange={(e) => setFormData({ ...formData, stockKg: e.target.value })}
                    placeholder="e.g. 50"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Kashmir Valley"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Health Benefits</label>
                <input
                  type="text"
                  value={formData.healthBenefits}
                  onChange={(e) => setFormData({ ...formData, healthBenefits: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="accent-rcb-red w-4 h-4"
                />
                <label htmlFor="isFeatured" className="font-semibold text-gray-800">
                  Feature in Bestseller Showcase & Royal Banner
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rcb-red hover:bg-rcb-deepRed text-white font-bold shadow-red transition"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
