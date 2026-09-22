import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Package,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();
  const { totalItemCount, setIsDrawerOpen, grandTotal } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Banner (RCB Pride Bar) */}
      <div className="bg-rcb-black border-b border-rcb-gold/30 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-rcb-red px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-white shadow">
              RCB 2026 EDITION
            </span>
            <span className="hidden sm:inline text-rcb-lightGold font-medium">
              Royal Dry Fruits for Champions. Use code <strong className="text-white bg-black/40 px-1 py-0.5 rounded border border-rcb-gold/50">RCB2026</strong> for 18% OFF!
            </span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            {/* Quick Role Switcher for Examiners */}
            <div className="hidden md:flex items-center space-x-2 text-[11px]">
              <span className="text-gray-400">Quick Demo Switch:</span>
              <button
                onClick={() => quickLogin('CUSTOMER')}
                className="hover:text-rcb-gold underline cursor-pointer"
                title="Switch to Customer account"
              >
                Customer
              </button>
              <span className="text-gray-600">•</span>
              <button
                onClick={() => quickLogin('ADMIN')}
                className="text-rcb-gold font-bold hover:underline cursor-pointer"
                title="Switch to Admin account"
              >
                Admin
              </button>
            </div>
            <span className="hidden md:inline text-gray-600">|</span>
            <Link to="/contact" className="hover:text-rcb-gold transition">
              Help & Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-rcb-black/95 backdrop-blur-md border-b border-rcb-gold/20 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rcb-red via-rcb-deepRed to-black border border-rcb-gold flex items-center justify-center shadow-red group-hover:scale-105 transition-transform">
              <span className="text-xl">👑</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-black tracking-wider text-white flex items-center">
                DRYFRUIT<span className="text-rcb-red ml-0.5">KART</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-rcb-gold font-semibold uppercase -mt-1">
                ROYAL HARVEST
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4 relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium almonds, cashews, dates, pista..."
              className="w-full bg-rcb-dark border border-gray-700 focus:border-rcb-gold text-white text-sm rounded-full py-2 pl-4 pr-10 outline-none transition placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1 w-8 h-8 rounded-full bg-rcb-red text-white flex items-center justify-center hover:bg-rcb-deepRed transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link to="/shop" className="hover:text-rcb-gold transition">
              All Products
            </Link>
            <Link to="/shop?category=Almonds" className="hover:text-rcb-gold transition">
              Almonds
            </Link>
            <Link to="/shop?category=Cashews" className="hover:text-rcb-gold transition">
              Cashews
            </Link>
            <Link to="/shop?category=Pistachios" className="hover:text-rcb-gold transition">
              Pistachios
            </Link>
            <Link to="/shop?category=Hampers" className="text-rcb-lightGold flex items-center space-x-1 hover:text-white transition">
              <Sparkles className="w-3.5 h-3.5 text-rcb-gold animate-pulse" />
              <span>Royal Hampers</span>
            </Link>
          </div>

          {/* User Controls & Cart Button */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Admin Badge if logged in as Admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-rcb-red to-rcb-deepRed border border-rcb-gold/50 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-red hover:brightness-110 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rcb-gold" />
                <span>Admin Portal</span>
              </Link>
            )}

            {/* User Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1.5 py-1.5 px-2.5 rounded-lg hover:bg-rcb-dark border border-gray-700/60 transition text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-rcb-gold text-rcb-black font-bold flex items-center justify-center text-xs">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline font-medium text-xs max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-rcb-dark border border-rcb-gold/30 rounded-xl shadow-2xl py-2 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-gray-800">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-rcb-red/30 text-rcb-lightGold border border-rcb-gold/30">
                          Role: {user.role}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-rcb-lightGold hover:bg-rcb-red/20 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-rcb-gold" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/my-orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-800 transition"
                      >
                        <Package className="w-4 h-4 text-rcb-gold" />
                        <span>My Orders</span>
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-red-950/40 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg border border-rcb-gold/40 text-rcb-gold hover:bg-rcb-gold hover:text-black transition"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative flex items-center space-x-2 bg-gradient-to-r from-rcb-red to-rcb-deepRed hover:brightness-110 text-white px-3.5 py-2 rounded-xl font-medium text-sm transition shadow-red border border-rcb-gold/40"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4 text-rcb-gold" />
              <span className="hidden sm:inline font-bold">Cart</span>
              {totalItemCount > 0 && (
                <span className="bg-rcb-gold text-rcb-black text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-800 space-y-3">
            <form onSubmit={handleSearch} className="flex relative items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dry fruits..."
                className="w-full bg-rcb-dark border border-gray-700 text-white text-sm rounded-lg py-2 pl-3 pr-10 outline-none"
              />
              <button
                type="submit"
                className="absolute right-1 w-8 h-8 rounded-lg bg-rcb-red text-white flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2 text-sm font-medium pt-1">
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-rcb-dark px-3 py-2 rounded-lg text-gray-200"
              >
                All Products
              </Link>
              <Link
                to="/shop?category=Almonds"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-rcb-dark px-3 py-2 rounded-lg text-gray-200"
              >
                Almonds
              </Link>
              <Link
                to="/shop?category=Cashews"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-rcb-dark px-3 py-2 rounded-lg text-gray-200"
              >
                Cashews
              </Link>
              <Link
                to="/shop?category=Pistachios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-rcb-dark px-3 py-2 rounded-lg text-gray-200"
              >
                Pistachios
              </Link>
              <Link
                to="/shop?category=Dates"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-rcb-dark px-3 py-2 rounded-lg text-gray-200"
              >
                King Dates
              </Link>
              <Link
                to="/shop?category=Hampers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-rcb-dark px-3 py-2 rounded-lg text-rcb-lightGold font-bold"
              >
                Luxury Hampers 🎁
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
              <span>Quick Login Demo:</span>
              <div className="space-x-3">
                <button
                  onClick={() => {
                    quickLogin('CUSTOMER');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-white hover:text-rcb-gold underline"
                >
                  Customer
                </button>
                <button
                  onClick={() => {
                    quickLogin('ADMIN');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-rcb-gold font-bold hover:underline"
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
