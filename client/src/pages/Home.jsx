import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  Crown,
  HeartPulse,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/customer/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products?isFeatured=true')
      .then((res) => {
        setFeaturedProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Almonds', icon: '🌰', count: 'Mamra & California', path: '/shop?category=Almonds' },
    { name: 'Cashews', icon: '🥜', count: 'W240 King Size', path: '/shop?category=Cashews' },
    { name: 'Pistachios', icon: '🟢', count: 'Iranian Green Pista', path: '/shop?category=Pistachios' },
    { name: 'Walnuts', icon: '🧠', count: 'Kashmiri Halves', path: '/shop?category=Walnuts' },
    { name: 'Dates', icon: '🌴', count: 'Royal Medjool & Ajwa', path: '/shop?category=Dates' },
    { name: 'Raisins', icon: '🍇', count: 'Afghan Sun-Dried', path: '/shop?category=Raisins' },
    { name: 'Exotic Figs', icon: '🍯', count: 'Golden Anjeer', path: '/shop?category=Exotic' },
    { name: 'Hampers', icon: '🎁', count: 'Royal RCB Gift Boxes', path: '/shop?category=Hampers' },
  ];

  return (
    <div className="flex-1">
      {/* Hero Section — Styled in RCB 2026 Red · Black · Gold */}
      <section className="relative bg-rcb-black text-white overflow-hidden py-16 md:py-24 border-b-2 border-rcb-gold/30">
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rcb-red/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-rcb-gold/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rcb-red/30 to-rcb-gold/20 border border-rcb-gold/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-rcb-lightGold">
                <Crown className="w-4 h-4 text-rcb-gold" />
                <span>OFFICIAL 2026 RCB GOLD & RED EDITION</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Play Bold.{' '}
                <span className="text-rcb-red underline decoration-rcb-gold decoration-wavy decoration-2">
                  Eat Bold.
                </span>{' '}
                <br />
                <span className="gold-text-gradient">Royal Dry Fruits</span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Sourced from the pristine orchards of Kashmir, California, and Iran. Hand-picked, vacuum sealed, and delivered fresh to power your daily stamina and royal lifestyle.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white font-bold text-sm shadow-red hover:scale-105 transition-all flex items-center justify-center space-x-2 border border-rcb-gold/50"
                >
                  <span>Explore Royal Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/shop?category=Hampers"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-rcb-dark border border-rcb-gold/50 text-rcb-gold hover:bg-rcb-gold hover:text-black font-bold text-sm transition flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Celebration Hampers</span>
                </Link>
              </div>

              {/* Trust Counters */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800 max-w-lg mx-auto lg:mx-0 text-center">
                <div>
                  <div className="text-2xl font-black text-rcb-gold">100%</div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Natural Grade A</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-rcb-red">24-Hr</div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Fresh Dispatch</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white">4.9 ★</div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">50K+ Happy Fans</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-rcb-gold/60 shadow-2xl bg-gradient-to-br from-rcb-dark to-black p-2">
                <img
                  src="https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1000&q=80"
                  alt="Royal Dry Fruits Collection"
                  className="w-full h-96 object-cover rounded-2xl"
                />

                {/* Floating Highlight Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-md border border-rcb-gold/60 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl">
                  <div>
                    <span className="text-[10px] font-bold text-rcb-gold uppercase tracking-wider block">
                      Featured Box
                    </span>
                    <h4 className="font-bold text-sm">RCB Royal Gold Hamper</h4>
                    <p className="text-xs text-gray-400">Mamra, Pista, Cashew & King Dates</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 line-through">₹2,999</span>
                    <span className="block text-lg font-black text-rcb-red">₹2,499</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="py-12 bg-rcb-paper border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-rcb-red uppercase tracking-wider">
                Browse By Category
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-rcb-black mt-1">
                Hand-Selected Superfruits
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-3 sm:mt-0 text-xs font-bold text-rcb-black hover:text-rcb-red flex items-center space-x-1"
            >
              <span>View All 8 Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className="bg-white rounded-xl p-3 text-center border border-gray-200 hover:border-rcb-gold hover:shadow-lg transition-all group flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-amber-50 group-hover:bg-rcb-red/10 flex items-center justify-center text-2xl mb-2 transition">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-xs text-gray-900 group-hover:text-rcb-red transition">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                  {cat.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-rcb-red text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-rcb-red" />
              <span>Championship Selection</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-gray-900 mt-1">
              Bestselling Royal Dry Fruits
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Top rated by our community of wellness and dry fruit lovers across India.
            </p>
          </div>

          <Link
            to="/shop"
            className="mt-4 sm:mt-0 px-5 py-2 rounded-xl bg-rcb-black text-rcb-gold border border-rcb-gold text-xs font-bold hover:bg-rcb-red hover:text-white hover:border-rcb-red transition"
          >
            Explore Full Menu →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose DryFruitKart (Royal Guarantee) */}
      <section className="bg-gradient-to-br from-rcb-black via-rcb-dark to-black text-white py-16 border-y-2 border-rcb-gold/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="bg-rcb-red text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
              Purity Promise
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black mt-3 gold-text-gradient">
              The Royal Standard of Dry Fruits
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Every single batch is laboratory tested for moisture retention, zero chemical polish, and natural kernel crunch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-rcb-dark/80 border border-rcb-gold/30 rounded-2xl p-6 text-center space-y-3 hover:border-rcb-gold transition">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-rcb-red/20 border border-rcb-red flex items-center justify-center text-rcb-gold">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-white">Triple Sort Inspection</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Hand-inspected by dry fruit artisans. Only extra large, unbroken whole kernels pass our rigorous 3-point audit.
              </p>
            </div>

            <div className="bg-rcb-dark/80 border border-rcb-gold/30 rounded-2xl p-6 text-center space-y-3 hover:border-rcb-gold transition">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-white">Heart & Brain Nutrition</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Dense in plant-based Omega-3, natural antioxidant Vitamin E, and heart-healthy monounsaturated fatty acids.
              </p>
            </div>

            <div className="bg-rcb-dark/80 border border-rcb-gold/30 rounded-2xl p-6 text-center space-y-3 hover:border-rcb-gold transition">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-white">Eco Vacuum Packaging</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Food-grade nitrogen sealed zip pouches keep moisture and oxygen out, preserving tree-fresh crunch for up to 9 months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RCB 2026 Promo Banner Strip */}
      <section className="bg-gradient-to-r from-rcb-red via-rcb-deepRed to-black text-white py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-rcb-lightGold font-bold text-xs uppercase tracking-wider">
              Limited Festival Coupon
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black">
              Get Flat 18% OFF on All Royal Orders
            </h3>
            <p className="text-xs text-red-100">
              Apply coupon <code className="bg-black/50 text-rcb-gold px-2 py-0.5 rounded font-mono font-bold">RCB2026</code> at checkout. Minimum cart value ₹799.
            </p>
          </div>

          <Link
            to="/shop"
            className="shrink-0 px-8 py-3.5 bg-rcb-gold hover:bg-yellow-400 text-rcb-black font-black text-sm rounded-xl shadow-lg transition transform hover:scale-105"
          >
            Claim 18% Discount Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
