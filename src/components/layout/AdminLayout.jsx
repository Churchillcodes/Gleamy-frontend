import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { HiMenu } from "react-icons/hi";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Page Space */}
      <div className="grow flex flex-col lg:pl-64 min-h-screen">
        {/* Mobile Header Bar */}
        <header className="bg-warm-cream border-b border-walnut-brown/10 px-4 py-4 flex items-center justify-between lg:hidden sticky top-0 z-30">
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
        <main className="grow p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
