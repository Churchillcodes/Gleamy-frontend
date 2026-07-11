import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaWhatsapp } from "react-icons/fa";
import { generateWhatsAppLink } from "../../utils/whatsappLink";

export default function PublicLayout() {
  const handleFloatingClick = () => {
    const text =
      "Hi gleamy Baby Cots & Furniture, I visited your website and would like to make an inquiry.";
    const link = generateWhatsAppLink(text);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col justify-between selection:bg-soft-sage/30">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Floating WhatsApp Action Button */}
      <button
        onClick={handleFloatingClick}
        className="fixed bottom-6 right-6 z-50 bg-whatsapp-green text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} className="animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-semibold">
          Chat with Us
        </span>
      </button>
    </div>
  );
}
