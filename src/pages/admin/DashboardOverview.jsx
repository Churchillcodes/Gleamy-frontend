import React, { useState, useEffect } from "react";
import { dashboardApi } from "../../api/dashboardApi";
import { orderApi } from "../../api/orderApi";
import StatCard from "../../components/dashboard/StatCard";
import OrderTable from "../../components/order/OrderTable";
import OrderDetailModal from "../../components/order/OrderDetailModal";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  HiOutlineCurrencyDollar,
  HiOutlineCollection,
  HiOutlineShoppingBag,
  HiOutlineClipboardList,
} from "react-icons/hi";
import toast from "react-hot-toast";

export default function DashboardOverview() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [leadAnalytics, setLeadAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [summaryData, revenueData, leadAnalyticsData, ordersData] =
        await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getRevenue(),
          dashboardApi.getLeadAnalytics(),
          orderApi.getAllOrders(),
        ]);

      setSummary(summaryData);
      setRevenue(revenueData);
      setLeadAnalytics(leadAnalyticsData);

      // Sort orders by date descending and take top 5
      const sorted = [...ordersData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setRecentOrders(sorted.slice(0, 5));
    } catch (err) {
      toast.error("Failed to load dashboard metrics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleOrderUpdate = () => {
    // Reload dashboard state to update stats and table
    loadDashboardData();
  };

  if (loading) {
    return <Loader type="spinner" className="min-h-[60vh]" />;
  }

  const activeVSArchived = summary
    ? `${summary.activeProducts} Active / ${summary.archivedProducts} Archived`
    : "0 / 0";

  const pendingVSConfirmed = summary
    ? `${summary.pendingOrders} Pending / ${summary.confirmedOrders} Confirmed`
    : "0 / 0";

  const lowStockText = summary
    ? `${summary.lowStockProducts} Low Stock`
    : "0 Low Stock";

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-walnut-brown leading-tight">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-text/50 uppercase tracking-wider font-semibold">
          gleamy Baby Cots & Furniture Workshop
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Store Revenue"
          value={formatCurrency(revenue?.totalRevenue || 0)}
          icon={HiOutlineCurrencyDollar}
          description="Accumulated sales historical total"
          variant="walnut"
        />

        <StatCard
          title="Monthly Sales Volume"
          value={formatCurrency(revenue?.monthlyRevenue || 0)}
          icon={HiOutlineCurrencyDollar}
          description="Transactions from this calendar month"
          variant="default"
        />

        <StatCard
          title="Product Inventory"
          value={summary?.totalProducts || 0}
          icon={HiOutlineCollection}
          description={`${activeVSArchived} • ${lowStockText}`}
          variant="default"
        />

        <StatCard
          title="Customer Orders"
          value={summary?.totalOrders || 0}
          icon={HiOutlineShoppingBag}
          description={pendingVSConfirmed}
          variant="default"
        />
      </div>

      <div className="bg-white border border-walnut-brown/10 rounded-2xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-walnut-brown mb-4">
          Lead Analytics
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-charcoal-text/60">Total Leads</p>

            <p className="text-3xl font-bold text-walnut-brown">
              {leadAnalytics?.totalLeads || 0}
            </p>
          </div>

          <div>
            <p className="text-sm text-charcoal-text/60">Top Source</p>

            <p className="font-semibold text-soft-sage">
              {leadAnalytics?.topSource || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-charcoal-text/60 mb-2">Lead Sources</p>

            <div className="space-y-2">
              {leadAnalytics?.leadSources?.map((item) => (
                <div key={item.source} className="flex justify-between text-sm">
                  <span>{item.source}</span>

                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
        <div className="border-b border-walnut-brown/10 pb-3 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-walnut-brown flex items-center gap-2">
              <HiOutlineClipboardList className="text-soft-sage" /> Recent
              Customer Inquiries
            </h2>
            <p className="text-xs text-charcoal-text/50 font-medium">
              Orders manually logged from client WhatsApp chats
            </p>
          </div>
        </div>

        <OrderTable orders={recentOrders} onOpenDetail={handleOpenDetail} />
      </div>

      {/* Order Detail Drawer Modal */}
      {selectedOrder && (
        <OrderDetailModal
          isOpen={detailOpen}
          onClose={() => {
            setDetailOpen(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onOrderUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
