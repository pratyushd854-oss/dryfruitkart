import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const res = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.phone
    );

    if (res.success) {
      navigate('/shop');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-rcb-black text-white flex items-center justify-center mx-auto mb-3 border-2 border-rcb-gold shadow-md">
            <span className="text-2xl">👑</span>
          </div>
          <h1 className="font-display text-2xl font-black text-gray-900">Create Account</h1>
          <p className="text-xs text-gray-500 mt-1">Join the DryFruitKart Royal Family</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Virat Kohli"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="virat@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98801 23456"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white font-bold rounded-xl shadow-red hover:brightness-110 transition flex items-center justify-center space-x-2"
          >
            {loading ? <span>Creating Account...</span> : <span>Register Now</span>}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-rcb-red hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
