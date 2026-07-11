import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { HiMenu } from "react-icons/hi";
import { Toaster } from "react-hot-toast";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col md:flex-row">
      {/* Toast Feedbacks */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#5C4033",
            color: "#FAF6F0",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            borderRadius: "8px",
          },
          success: {
            iconTheme: {
              primary: "#B7C4A0",
              secondary: "#5C4033",
            },
          },
        }}
      />

      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Page Space */}
      <div className="flex-grow flex flex-col md:pl-64 min-h-screen">
        {/* Mobile Header Bar */}
        <header className="bg-warm-cream border-b border-walnut-brown/10 px-4 py-4 flex items-center justify-between md:hidden sticky top-0 z-30">
          <button
            onClick={toggleSidebar}
            className="text-walnut-brown focus:outline-none p-2 rounded-md hover:bg-walnut-brown/5"
            aria-label="Open navigation sidebar"
          >
            <HiMenu size={26} />
          </button>
          <Link to="/admin" className="flex flex-col items-center">
            <span className="font-heading text-lg font-bold tracking-tight text-walnut-brown leading-none">
              gleamy Admin
            </span>
            <span className="text-[9px] tracking-wider uppercase font-semibold text-soft-sage mt-0.5">
              Control Panel
            </span>
          </Link>
          <div className="w-9" /> {/* Spacer */}
        </header>

        {/* Admin Content Area */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
