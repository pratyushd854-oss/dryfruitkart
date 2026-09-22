import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  RotateCcw,
  Store,
  ShieldCheck,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex-1">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-xl text-gray-900">Access Restricted</h2>
        <p className="text-xs text-gray-500 mt-1">
          You must be signed in with an Administrator account to view this section.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block px-5 py-2.5 bg-rcb-red text-white text-xs font-bold rounded-xl shadow-red"
        >
          Sign in as Admin
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: 'Executive Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Orders & Buyers', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Returns & Refunds', path: '/admin/returns', icon: RotateCcw },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-rcb-black text-white flex flex-col justify-between border-r border-rcb-gold/30 shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="text-2xl">👑</span>
              <div>
                <span className="font-display text-base font-black tracking-wider text-white">
                  DRYFRUIT<span className="text-rcb-red">KART</span>
                </span>
                <span className="block text-[10px] text-rcb-gold font-bold uppercase tracking-wider">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white shadow-red border border-rcb-gold/40'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rcb-gold' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar User Info & Store Link */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rcb-lightGold hover:bg-gray-800 transition"
          >
            <Store className="w-4 h-4 text-rcb-gold" />
            <span>Switch to Customer Store</span>
          </Link>

          <div className="pt-2 border-t border-gray-800 flex items-center justify-between">
            <div className="text-xs truncate">
              <div className="font-bold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-rcb-gold">Administrator</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
