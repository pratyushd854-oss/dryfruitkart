import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/customer/ProductCard';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const [priceRange, setPriceRange] = useState(3000);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    api.get('/products/categories').then((res) => {
      setCategories(['All', ...res.data]);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();

    if (selectedCategory && selectedCategory !== 'All') {
      params.append('category', selectedCategory);
    }
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    if (priceRange) {
      params.append('maxPrice', priceRange);
    }
    if (sortBy) {
      params.append('sort', sortBy);
    }

    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const handleCategorySelect = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams({});
    setPriceRange(3000);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900">
          Royal Dry Fruit Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Explore our handpicked almonds, whole cashews, pistachios, dates & luxury hampers.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-rcb-black text-rcb-gold border-rcb-gold shadow-gold'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat === 'All' ? '👑 All Varieties' : cat}
          </button>
        ))}
      </div>

      {/* Filter and Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search inside shop */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by variety, origin..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end w-full md:w-auto gap-4">
          {/* Price Range Slider */}
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="font-semibold">Max Price/Kg:</span>
            <input
              type="range"
              min="500"
              max="3000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="accent-rcb-red w-28 sm:w-36 cursor-pointer"
            />
            <span className="font-bold text-rcb-red min-w-[55px]">
              ₹{priceRange}
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-gray-600">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold text-gray-800 outline-none focus:border-rcb-red cursor-pointer"
            >
              <option value="popular">Bestselling</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== 'All' || searchQuery || priceRange < 3000) && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 text-xs text-rcb-red hover:underline font-bold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-84 animate-pulse border border-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-gray-900 text-lg">No Dry Fruits Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting your search keywords, clearing categories, or increasing the price filter.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-rcb-red text-white text-xs font-bold rounded-xl shadow hover:bg-rcb-deepRed transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs text-gray-500 mb-4 font-medium">
            Showing <strong className="text-gray-900">{products.length}</strong> royal items
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
