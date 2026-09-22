import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState('500g');
  const [isAdded, setIsAdded] = useState(false);

  const variants = [
    { label: '250g', weightKg: 0.25 },
    { label: '500g', weightKg: 0.5 },
    { label: '1kg', weightKg: 1.0 },
  ];

  const currentVariant = variants.find((v) => v.label === selectedVariant) || variants[1];
  const price = Math.round(product.pricePerKg * currentVariant.weightKg);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, currentVariant.label, currentVariant.weightKg, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const isLowStock = product.stockKg > 0 && product.stockKg <= 5;
  const isOutOfStock = product.stockKg <= 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-rcb-gold/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative">
      {/* Product Image Container */}
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden aspect-[4/3] bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="bg-rcb-black/90 border border-rcb-gold/60 text-rcb-lightGold text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              👑 Royal Pick
            </span>
          )}
          {isLowStock && (
            <span className="bg-rcb-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow animate-pulse">
              Only {product.stockKg}kg left!
            </span>
          )}
        </div>

        {/* Category tag */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-white/20">
            {product.category}
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.numReviews})</span>
            <span className="text-[11px] text-gray-400 ml-auto truncate max-w-[110px]">
              {product.origin}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-snug group-hover:text-rcb-red transition line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Variant Selector */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs mb-1.5 text-gray-500 font-medium">
            <span>Select Pack:</span>
            <span className="text-[11px] text-gray-400">
              ₹{product.pricePerKg}/kg
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {variants.map((v) => (
              <button
                key={v.label}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(v.label);
                }}
                className={`text-xs py-1 rounded-lg font-semibold transition border ${
                  selectedVariant === v.label
                    ? 'bg-rcb-black text-rcb-gold border-rcb-gold shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Price & Add to Cart Button */}
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-xs text-gray-400 block -mb-0.5">Price:</span>
              <span className="text-lg font-black text-rcb-red">
                {formatCurrency(price)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-200'
                  : 'bg-rcb-red hover:bg-rcb-deepRed text-white shadow-red hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-rcb-gold" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
