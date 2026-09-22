import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, User, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, quickLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } else {
      setError(res.message);
    }
  };

  const handleQuickLogin = async (role) => {
    setError('');
    const res = await quickLogin(role);
    if (res.success) {
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-rcb-black text-white flex items-center justify-center mx-auto mb-3 border-2 border-rcb-gold shadow-md">
            <span className="text-2xl">👑</span>
          </div>
          <h1 className="font-display text-2xl font-black text-gray-900">Welcome Back</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to DryFruitKart Royal Account</p>
        </div>

        {/* Quick Demo Login Switcher for College Examiner/Professor */}
        <div className="mb-6 p-3 bg-amber-50/70 border border-amber-300 rounded-2xl">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Capstone Evaluator Quick Login:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('CUSTOMER')}
              className="py-2 px-3 rounded-xl bg-white border border-gray-300 hover:border-rcb-red text-gray-800 text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="py-2 px-3 rounded-xl bg-rcb-black border border-rcb-gold text-rcb-gold hover:bg-gray-900 text-xs font-bold shadow transition flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rcb-gold" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@dryfruitkart.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white font-bold rounded-xl shadow-red hover:brightness-110 transition flex items-center justify-center space-x-2"
          >
            {loading ? <span>Signing in...</span> : <span>Sign In</span>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-rcb-red hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
