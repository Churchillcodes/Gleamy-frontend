import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import PersistLogin from "./PersistLogin";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Protection guard
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "../pages/public/Home";
import Catalogue from "../pages/public/Catalogue";
import ProductDetails from "../pages/public/ProductDetails";
import Contact from "../pages/public/Contact";

// Auth Pages
import Login from "../pages/auth/Login";

// Admin Pages
import DashboardOverview from "../pages/admin/DashboardOverview";
import ProductsPage from "../pages/admin/ProductsPage";
import OrdersPage from "../pages/admin/OrdersPage";
import SalesPage from "../pages/admin/SalesPage";
import AnalyticsPage from "../pages/admin/AnalyticsPage";

// 404 Page Component
function NotFound() {
  return (
    <div className="min-h-screen bg-warm-cream flex flex-col items-center justify-center text-center p-4">
      <h1 className="font-heading text-6xl font-extrabold text-walnut-brown mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-walnut-brown mb-4">
        Page Not Found
      </h2>
      <p className="text-sm text-charcoal-text/75 max-w-sm mb-6 leading-relaxed">
        The cot, wardrobe, or dashboard directory you are looking for does not
        exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-walnut-brown text-warm-cream font-semibold rounded-xl text-sm hover:opacity-90 shadow-md transition-all active:scale-98"
      >
        Return to Shopfront
      </Link>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Customer Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Dashboard Control Panel */}
      <Route element={<PersistLogin />}>
        {/* Admin Login */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>

      {/* Catch all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
