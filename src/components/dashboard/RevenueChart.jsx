import React, { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function RevenueChart({ data = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 1. DEFENSIVE GUARD: Handle empty, invalid or undefined array structures safely
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-walnut-brown/10 flex items-center justify-center h-64 text-sm font-semibold text-charcoal-text/40">
        No revenue trend data available
      </div>
    );
  }

  // Dimension config
  const svgWidth = 600;
  const svgHeight = 240;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Extract values
  const revenues = data.map((d) => d?.revenue || 0);
  const maxRevenue = Math.max(...revenues, 1000); // Guard against divide by zero

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1 || 1)) * chartWidth;
    const y =
      paddingTop + chartHeight - ((d?.revenue || 0) / maxRevenue) * chartHeight;
    return { x, y, ...d };
  });

  // Construct path coordinates
  const linePath =
    points.length > 0
      ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
      : "";

  // Gradient area path (close the shape to the bottom of the chart area)
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
      : "";

  return (
    <div className="bg-white p-6 rounded-2xl border border-walnut-brown/10 shadow-xs relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-heading text-base font-bold text-walnut-brown">
            Revenue Trend
          </h3>
          <p className="text-xs text-charcoal-text/50 font-medium">
            Tracking store revenue progression
          </p>
        </div>

        {/* Hover Detail Widget */}
        {hoveredPoint && (
          <div className="bg-walnut-brown text-warm-cream text-xs px-2.5 py-1 rounded-lg font-bold shadow-sm animate-fadeIn">
            {hoveredPoint.label || hoveredPoint.date || "Date N/A"}:{" "}
            <span className="text-white">
              {formatCurrency(hoveredPoint.revenue || 0)}
            </span>
          </div>
        )}
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          height="100%"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5C4033" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#5C4033" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, idx) => {
            const y = paddingTop + (idx * chartHeight) / 3;
            const value = maxRevenue - (idx * maxRevenue) / 3;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#5C4033"
                  strokeOpacity="0.06"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#2B2622"
                  fillOpacity="0.5"
                  textAnchor="end"
                  className="text-[9px] font-semibold"
                >
                  {value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                </text>
              </g>
            );
          })}

          {/* Trend Area Gradient */}
          {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}

          {/* Trend Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#5C4033"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Nodes (Dots) */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={hoveredPoint?.x === p.x ? 6 : 4}
              fill={hoveredPoint?.x === p.x ? "#B7C4A0" : "#5C4033"}
              stroke="#FAF6F0"
              strokeWidth="2"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* X Axis Labels */}
          {points.map((p, idx) => {
            // Show every other or every 3rd label depending on data size
            if (points.length > 8 && idx % 2 !== 0) return null;

            // 2. DEFENSIVE SUBSTRING CHECK: Extract string safely or fallback gracefully
            const rawDate = p?.label || p?.date || p?.month || "";
            const displayLabel = rawDate
              ? rawDate.length > 5
                ? rawDate.substring(5)
                : rawDate
              : "N/A";

            return (
              <text
                key={idx}
                x={p.x}
                y={svgHeight - paddingBottom + 18}
                fill="#2B2622"
                fillOpacity="0.5"
                textAnchor="middle"
                className="text-[9px] font-bold"
              >
                {displayLabel}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
