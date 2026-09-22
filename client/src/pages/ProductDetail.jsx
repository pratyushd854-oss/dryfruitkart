import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Heart,
  Share2,
  ChevronRight,
  Sparkles,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const variants = [
    { label: '250g', weightKg: 0.25, popular: false },
    { label: '500g', weightKg: 0.5, popular: true },
    { label: '1kg', weightKg: 1.0, popular: false },
  ];

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rcb-gold border-t-rcb-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center flex-1">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-gray-500 text-sm mt-2">The dry fruit item you are looking for does not exist.</p>
        <Link to="/shop" className="mt-4 inline-block px-5 py-2 bg-rcb-red text-white text-xs font-bold rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  const currentVariant = variants.find((v) => v.label === selectedVariant) || variants[1];
  const unitPrice = Math.round(product.pricePerKg * currentVariant.weightKg);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, currentVariant.label, currentVariant.weightKg, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, currentVariant.label, currentVariant.weightKg, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
        <Link to="/" className="hover:text-rcb-red">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-rcb-red">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-rcb-red">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-rcb-gold/50 shadow-xl bg-white aspect-square">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-rcb-black text-rcb-gold border border-rcb-gold px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RCB Royal Standard</span>
                </div>
              )}

              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow flex items-center justify-center text-gray-600 hover:text-rcb-red transition">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Badges strip under image */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <ShieldCheck className="w-5 h-5 text-rcb-gold mx-auto mb-1" />
                <div className="text-[11px] font-bold text-gray-800">100% Authentic</div>
                <div className="text-[10px] text-gray-400">Direct Farm Sourced</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <Package className="w-5 h-5 text-rcb-red mx-auto mb-1" />
                <div className="text-[11px] font-bold text-gray-800">Nitrogen Sealed</div>
                <div className="text-[10px] text-gray-400">Moisture-Proof Zip</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <Truck className="w-5 h-5 text-rcb-gold mx-auto mb-1" />
                <div className="text-[11px] font-bold text-gray-800">Swift 24h Courier</div>
                <div className="text-[10px] text-gray-400">Pan-India Express</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Purchasing Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-rcb-red/10 text-rcb-red border border-rcb-red/20 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs text-gray-500">
                Origin: <strong className="text-gray-800">{product.origin}</strong>
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-black text-gray-900 mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                <span className="text-xs font-bold text-gray-800">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500">
                Based on {product.numReviews} verified customer reviews
              </span>
            </div>
          </div>

          {/* Pricing & Stock Banner */}
          <div className="bg-gradient-to-r from-rcb-paper via-white to-amber-50/50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400 block">Offer Price ({currentVariant.label}):</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-black text-rcb-red">
                  {formatCurrency(unitPrice)}
                </span>
                <span className="text-xs text-gray-400">
                  (₹{product.pricePerKg}/kg)
                </span>
              </div>
            </div>

            <div className="text-right">
              {product.stockKg > 5 ? (
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                  ● In Stock ({product.stockKg}kg available)
                </span>
              ) : product.stockKg > 0 ? (
                <span className="inline-flex items-center text-xs font-bold text-rcb-red bg-red-100 px-2.5 py-1 rounded-full border border-red-300 animate-pulse">
                  ⚠️ Low Stock (Only {product.stockKg}kg left!)
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-bold text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Variant Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Package Weight:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {variants.map((v) => (
                <button
                  key={v.label}
                  type="button"
                  onClick={() => setSelectedVariant(v.label)}
                  className={`p-3 rounded-xl border text-left transition relative ${
                    selectedVariant === v.label
                      ? 'border-rcb-gold bg-rcb-black text-white shadow-gold'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-800'
                  }`}
                >
                  <div className="text-sm font-bold">{v.label}</div>
                  <div className={`text-xs mt-0.5 ${selectedVariant === v.label ? 'text-rcb-lightGold' : 'text-gray-500'}`}>
                    {formatCurrency(Math.round(product.pricePerKg * v.weightKg))}
                  </div>
                  {v.popular && (
                    <span className="absolute -top-2 right-2 bg-rcb-red text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      MOST POPULAR
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-base font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-base font-bold"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Subtotal: <strong className="text-gray-900 text-sm font-black">{formatCurrency(totalPrice)}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stockKg <= 0}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2 shadow ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rcb-black hover:bg-gray-900 text-rcb-gold border border-rcb-gold/70'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-rcb-gold" />
                    <span>Add to Royal Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockKg <= 0}
                className="py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white shadow-red hover:brightness-110 transition flex items-center justify-center space-x-2"
              >
                <span>Instant Checkout</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description & Health Benefits */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Product Description</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
              <h3 className="font-bold text-xs text-amber-900 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Health Benefits & Nutritional Highlights</span>
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                {product.healthBenefits}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
