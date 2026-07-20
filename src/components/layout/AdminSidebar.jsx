import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HiChartBar,
  HiCollection,
  HiClipboardList,
  HiOutlinePresentationChartLine,
  HiLogout,
  HiDocumentReport,
} from "react-icons/hi";
import useAuth from "../../hooks/useAuth";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin", icon: HiChartBar, exact: true },
    { name: "Products", path: "/admin/products", icon: HiCollection },
    { name: "Orders", path: "/admin/orders", icon: HiClipboardList },
    { name: "Sales Logs", path: "/admin/sales", icon: HiDocumentReport },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: HiOutlinePresentationChartLine,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const baseLinkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";
  const activeClass = "bg-walnut-brown text-warm-cream shadow-md font-semibold";
  const inactiveClass =
    "text-charcoal-text/75 hover:bg-walnut-brown/5 hover:text-walnut-brown";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/30 xl:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-warm-cream border-r border-walnut-brown/10 p-6 flex flex-col justify-between transform transition-transform duration-300 xl:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="flex flex-col border-b border-walnut-brown/15 pb-4">
            <img
              src="/gleamy-logo-compact.png"
              alt="Gleamy"
              className="h-18 sm:h-18 w-auto"
            />

            <span className="font-heading text-lg font-bold tracking-tight text-walnut-brown">
              Admin Control Panel
            </span>

            <span className="text-[10px] tracking-wider uppercase font-semibold text-soft-sage mt-0.5">
              Inventory & Orders
            </span>

            {user && (
              <span className="text-xs text-charcoal-text/50 mt-2 font-medium">
                Logged in as:
                <strong className="text-charcoal-text/80 ml-1">
                  {user.username}
                </strong>
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.exact}
                onClick={() => {
                  if (window.innerWidth < 1280) {
                    toggleSidebar();
                  }
                }}
                className={({ isActive }) =>
                  `${baseLinkClass} ${isActive ? activeClass : inactiveClass}`
                }
              >
                <link.icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 transition-colors border border-red-200/40"
          >
            <HiLogout size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
