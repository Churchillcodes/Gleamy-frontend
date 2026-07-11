import React from "react";
import { Link } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { DEFAULT_WHATSAPP_NUMBER } from "../../utils/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-walnut-brown text-warm-cream border-t border-walnut-brown/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link to="/" className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                gleamy
              </span>
              <span className="text-xs tracking-wider uppercase font-semibold text-soft-sage -mt-1">
                Baby Cots & Furniture
              </span>
            </Link>
            <p className="text-warm-cream/70 text-sm max-w-sm mt-3 leading-relaxed">
              Premium wooden nursery cots, chests of drawers, wardrobes, TV
              stands, and home fittings. Masterfully crafted by hand in Nairobi,
              Kenya, blending safety, trust, and premium carpentry.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-warm-cream/80 font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue"
                  className="hover:text-white transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Baby+Furniture"
                  className="hover:text-white transition-colors"
                >
                  Baby Furniture
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogue?category=Storage+Furniture"
                  className="hover:text-white transition-colors"
                >
                  Storage & Wardrobes
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours & Contact */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm text-warm-cream/80">
              <li className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-soft-sage" />
                <span>
                  Showroom & Workshop,
                  <br />
                  Ngong Road, Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <FaPhoneAlt className="flex-shrink-0 text-soft-sage" />
                <a
                  href="tel:+254719246761"
                  className="hover:text-white transition-colors"
                >
                  +254 719 246761
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaEnvelope className="flex-shrink-0 text-soft-sage" />
                <a
                  href="mailto:info@gleamyfurniture.co.ke"
                  className="hover:text-white transition-colors"
                >
                  info@gleamyfurniture.co.ke
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FaWhatsapp className="flex-shrink-0 text-whatsapp-green" />
                <a
                  href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white text-whatsapp-green font-semibold transition-colors"
                >
                  Chat with Naomi & Ivan
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-warm-cream/55 font-medium gap-4">
          <p>
            &copy; {currentYear} gleamy Baby Cots & Furniture. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
