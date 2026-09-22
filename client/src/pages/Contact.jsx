import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-rcb-gold uppercase tracking-wider bg-rcb-black px-3 py-1 rounded-full border border-rcb-gold/40">
          24/7 Concierge Support
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mt-2">
          Contact DryFruitKart
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Have an inquiry about wholesale hampers, order status, or dietary specifics? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-rcb-black text-white p-8 rounded-3xl border-2 border-rcb-gold/40 space-y-6 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="font-display text-xl font-black text-rcb-lightGold">
              RCB Royal Headquarters
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Located right in the heart of Bangalore next to Chinnaswamy Stadium.
            </p>

            <div className="space-y-4 mt-8 text-xs text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rcb-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Office Address:</strong>
                  <span>18 Chinnaswamy Stadium Road, MG Road, Bengaluru, Karnataka 560001</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-rcb-red shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Helpline (Toll-Free):</strong>
                  <span>+91 98765 43210 / 1800-DRYFRUIT</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-rcb-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white">Email Us:</strong>
                  <span>support@dryfruitkart.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rcb-dark border border-gray-800 text-xs text-gray-400">
            <span className="text-rcb-gold font-bold block mb-1">⏰ Operating Hours:</span>
            Monday - Saturday: 9:00 AM – 9:00 PM IST
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <h3 className="font-display text-lg font-bold text-gray-900 mb-4">
            Send Us a Message
          </h3>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Message Sent Successfully!</h4>
              <p className="text-xs text-emerald-700">
                Thank you for reaching out. Our customer care desk will reply within 4 working hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Virat Sharma"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="virat@example.com"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Corporate Hamper Inquiry / Order Status"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-rcb-red outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Message *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our royal dry fruit team assist you today?"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-rcb-red outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rcb-red to-rcb-deepRed text-white font-bold rounded-xl shadow-red hover:brightness-110 transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
