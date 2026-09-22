import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RotateCcw, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-rcb-red uppercase tracking-wider bg-red-50 border border-red-200 px-3 py-1 rounded-full">
          Customer Protection
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mt-2">
          7-Day Royal Return & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Our commitment to 100% tree-fresh purity and complete customer delight.
        </p>
      </div>

      <div className="space-y-6 text-sm text-gray-700 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-rcb-gold shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">7-Day Freshness Guarantee</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              If your dry fruits arrive damaged, with broken seals, or you find any discrepancy in crunch or quality, you are eligible for a no-questions-asked replacement or 100% full refund within 7 days of package delivery.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <RotateCcw className="w-5 h-5 text-rcb-red shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">Self-Service Return Workflow</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Simply navigate to <strong>My Orders</strong>, select your delivered order, and click <strong>"Request Return / Refund"</strong>. Enter the issue description and our team will review and approve within 24 business hours.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900 text-base">Refund Timeline</h3>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Once the return request is marked <strong>REFUNDED</strong> by our administrator, funds are credited back to your original payment mode (UPI/Card/Bank) within 3-5 working days. For Cash on Delivery orders, refunds are credited via instant UPI transfer.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Conditions for Return:</span> Items must retain at least 80% of original package weight and include original packaging/batch stickers.
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          to="/my-orders"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-rcb-black text-rcb-gold border border-rcb-gold font-bold text-xs rounded-xl hover:bg-gray-900 transition"
        >
          <span>Go to My Orders to Request Return</span>
        </Link>
      </div>
    </div>
  );
};

export default ReturnPolicy;
