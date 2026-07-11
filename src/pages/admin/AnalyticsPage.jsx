import React, { useState, useEffect } from "react";
import { salesApi } from "../../api/salesApi";
import RevenueChart from "../../components/dashboard/RevenueChart";
import TopProductsChart from "../../components/dashboard/TopProductsChart";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  HiOutlineChartPie,
  HiOutlineTrendingUp,
  HiOutlineFolderOpen,
} from "react-icons/hi";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [trendsData, topData, breakdownData] = await Promise.all([
          salesApi.getRevenueTrends(),
          salesApi.getTopProducts(),
          salesApi.getSalesBreakdown(),
        ]);

        // Ensure data assignments are arrays to protect downstream calculations
        setRevenueTrends(Array.isArray(trendsData) ? trendsData : []);
        setTopProducts(Array.isArray(topData) ? topData : []);
        setBreakdown(Array.isArray(breakdownData) ? breakdownData : []);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          toast.error(
            "Session expired. Please log in again to access admin data.",
          );
        } else {
          toast.error("Failed to load analytical metrics.");
        }
        console.error("Analytics Fetch Error:", err);

        // Clear states to fall back safely to empty arrays instead of undefined/error objects
        setRevenueTrends([]);
        setTopProducts([]);
        setBreakdown([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader type="spinner" className="min-h-[60vh]" />;
  }

  // Safe reduction fallback if breakdown is structural but compromised
  const safeBreakdown = Array.isArray(breakdown) ? breakdown : [];
  const totalRevenue = safeBreakdown.reduce(
    (acc, b) => acc + (b.revenue || 0),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-walnut-brown leading-tight">
          Performance & Insights
        </h1>
        <p className="text-xs text-charcoal-text/50 font-medium">
          Analyze revenue trends, top-selling lines, and category demand shares.
        </p>
      </div>

      {/* Grid of Trends and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Trend Chart - Spans 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart data={revenueTrends} />
        </div>

        {/* Right Category shares breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-walnut-brown/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-soft-sage/20 text-walnut-brown">
                <HiOutlineChartPie size={20} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-walnut-brown">
                  Category Demand Split
                </h3>
                <p className="text-xs text-charcoal-text/50 font-medium">
                  Share of store revenues
                </p>
              </div>
            </div>

            {safeBreakdown.length > 0 ? (
              <div className="space-y-5">
                {safeBreakdown.map((item, idx) => {
                  const percentage =
                    totalRevenue > 0
                      ? ((item.revenue || 0) / totalRevenue) * 100
                      : 0;

                  // Color codes
                  const progressColor =
                    idx === 0
                      ? "bg-walnut-brown"
                      : idx === 1
                        ? "bg-soft-sage"
                        : "bg-charcoal-text/30";

                  return (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-charcoal-text">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-walnut-brown font-bold tracking-wider">
                          {percentage.toFixed(0)}% ({item.count} items)
                        </span>
                      </div>

                      <div className="relative w-full h-3 bg-walnut-brown/5 rounded-full overflow-hidden border border-walnut-brown/5">
                        <div
                          style={{ width: `${percentage}%` }}
                          className={`h-full ${progressColor} transition-all duration-500 rounded-full`}
                        />
                      </div>
                      <div className="text-[10px] text-right font-semibold text-charcoal-text/50">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-center text-charcoal-text/40 text-xs font-semibold uppercase">
                No categorization logs
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-walnut-brown/5 text-xs text-charcoal-text/50 leading-relaxed font-semibold">
            Category data is aggregated dynamically as orders are marked
            complete.
          </div>
        </div>
      </div>

      {/* Top products list section */}
      <div className="grid grid-cols-1 gap-6">
        <TopProductsChart data={topProducts} />
      </div>
    </div>
  );
}
