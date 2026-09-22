import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rcb-black text-gray-400 mt-auto border-t-2 border-rcb-gold/30">
      {/* Value Proposition Strip */}
      <div className="border-b border-gray-800 bg-rcb-dark/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Award className="w-8 h-8 text-rcb-gold mb-2" />
            <h4 className="text-white font-bold text-sm">100% Royal Quality</h4>
            <p className="text-xs text-gray-400 mt-1">Strict triple-graded sorting</p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-8 h-8 text-rcb-red mb-2" />
            <h4 className="text-white font-bold text-sm">Express 24h Dispatch</h4>
            <p className="text-xs text-gray-400 mt-1">Free delivery above ₹999</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-rcb-gold mb-2" />
            <h4 className="text-white font-bold text-sm">Nitrogen Vacuum Sealed</h4>
            <p className="text-xs text-gray-400 mt-1">Locks aroma & crisp crunch</p>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="w-8 h-8 text-rcb-red mb-2" />
            <h4 className="text-white font-bold text-sm">7-Day Easy Returns</h4>
            <p className="text-xs text-gray-400 mt-1">100% refund guarantee</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Story */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👑</span>
            <span className="font-display text-xl font-bold text-white tracking-wider">
              DRYFRUIT<span className="text-rcb-red">KART</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Crafted with royal pride in Bangalore. Sourcing the purest harvest of Mamra almonds, king cashews, and saffron walnuts directly from Himalayan orchards and global boutique farms.
          </p>
          <div className="inline-block bg-rcb-red/20 border border-rcb-gold/40 px-3 py-1 rounded text-[11px] text-rcb-lightGold font-semibold">
            RCB 2026 Official Pride Colors
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 border-l-2 border-rcb-red pl-2">
            Categories
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/shop?category=Almonds" className="hover:text-rcb-gold transition">
                California & Mamra Almonds
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Cashews" className="hover:text-rcb-gold transition">
                W240 King Cashews
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Pistachios" className="hover:text-rcb-gold transition">
                Roasted Iranian Pistachios
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Walnuts" className="hover:text-rcb-gold transition">
                Kashmiri Snow White Walnuts
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Dates" className="hover:text-rcb-gold transition">
                Medjool & Ajwa King Dates
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Hampers" className="hover:text-rcb-gold transition">
                Celebration Luxury Hampers
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 border-l-2 border-rcb-gold pl-2">
            Customer Care
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/my-orders" className="hover:text-rcb-gold transition">
                Track My Order
              </Link>
            </li>
            <li>
              <Link to="/return-policy" className="hover:text-rcb-gold transition">
                Return & Refund Policy
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-rcb-gold transition">
                Contact & Support
              </Link>
            </li>
            <li>
              <span className="text-gray-500">Security & Privacy Terms</span>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 border-l-2 border-rcb-red pl-2">
            Bangalore Headquarters
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-rcb-gold shrink-0 mt-0.5" />
              <span>Chinnaswamy Stadium Road, MG Road, Bengaluru, Karnataka 560001</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-rcb-gold shrink-0" />
              <span>+91 98765 43210 / 1800-DRYFRUIT</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-rcb-gold shrink-0" />
              <span>support@dryfruitkart.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 px-4 text-center text-xs text-gray-500">
        <p>© 2026 DryFruitKart. College Capstone Evaluation Project. All rights reserved.</p>
        <p className="mt-1 text-[11px] text-gray-600">
          Crafted with React, Node.js, Express & Prisma ORM • Theme: #D0142C · #0B0B0C · #D4AF37
        </p>
      </div>
    </footer>
  );
};

export default Footer;
