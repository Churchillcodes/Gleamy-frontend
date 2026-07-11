import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { RiAdminLine } from "react-icons/ri";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Catalogue", path: "/catalogue" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-warm-cream border-b border-walnut-brown/10 sticky top-0 z-40 backdrop-blur-md/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-walnut-brown">
                Gleamy
              </span>
              <span className="text-[10px] sm:text-xs tracking-wider uppercase font-semibold text-soft-sage -mt-1.5">
                Baby Cots & Furniture
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors py-2 border-b-2 text-sm ${
                  isActive(link.path)
                    ? "border-walnut-brown text-walnut-brown font-semibold"
                    : "border-transparent text-charcoal-text/80 hover:text-walnut-brown hover:border-walnut-brown/30"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-walnut-brown text-warm-cream text-sm font-semibold hover:bg-walnut-brown/95 transition-all shadow-md"
              >
                <RiAdminLine size={16} />
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-charcoal-text/80 hover:text-walnut-brown text-sm font-medium transition-all"
                title="Admin Login"
              >
                <RiAdminLine size={18} />
                <span className="hidden sm:inline">Portal</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-walnut-brown hover:text-walnut-brown/80 focus:outline-none p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden bg-warm-cream border-t border-walnut-brown/10 animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? "bg-walnut-brown/5 text-walnut-brown font-bold"
                    : "text-charcoal-text/80 hover:bg-walnut-brown/5 hover:text-walnut-brown"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-walnut-brown/10 my-2 pt-2">
              {isAuthenticated && isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md bg-walnut-brown text-warm-cream text-base font-semibold hover:bg-walnut-brown/90 transition-colors shadow-sm"
                >
                  <RiAdminLine size={18} />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md border border-walnut-brown/30 text-walnut-brown text-base font-medium hover:bg-walnut-brown/5 transition-all"
                >
                  <RiAdminLine size={18} />
                  Admin Portal
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
