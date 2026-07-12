import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";
import { HiTrendingUp } from "react-icons/hi";

export default function TopProductsChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-walnut-brown/10 flex items-center justify-center h-64 text-sm font-semibold text-charcoal-text/40">
        No product sales data available
      </div>
    );
  }

  // Find max sales volume to scale bars
  const salesQuantities = data.map((d) => d.unitsSold || 0);
  const maxSales = Math.max(...salesQuantities, 1);

  return (
    <div className="bg-white p-6 rounded-2xl border border-walnut-brown/10 shadow-xs">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-soft-sage/20 text-walnut-brown">
          <HiTrendingUp size={20} />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-walnut-brown">
            Top Selling Products
          </h3>
          <p className="text-xs text-charcoal-text/50 font-medium">
            Ranked by volume of units sold
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, idx) => {
          const percentage = ((item.unitsSold || 0) / maxSales) * 100;

          return (
            <div key={item.productId || idx} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-charcoal-text truncate max-w-50 sm:max-w-xs">
                  {idx + 1}. {item.name || "Custom Build"}
                </span>
                <span className="text-[10px] font-bold text-walnut-brown tracking-wider">
                  {item.unitsSold} sold &middot;{" "}
                  <strong className="text-walnut-brown/80">
                    {formatCurrency(item.revenue)}
                  </strong>
                </span>
              </div>

              <div className="relative w-full h-3 bg-walnut-brown/5 rounded-full overflow-hidden border border-walnut-brown/5">
                <div
                  style={{ width: `${percentage}%` }}
                  className="h-full bg-soft-sage hover:bg-walnut-brown/40 transition-all duration-500 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
