import React from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../common/Button";
import { HiOutlineDocumentSearch } from "react-icons/hi";

export default function OrderTable({ orders = [], onOpenDetail }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white border border-walnut-brown/15 rounded-2xl">
        <span className="text-sm font-semibold text-charcoal-text/50 uppercase">
          No orders logged
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-walnut-brown/15 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-walnut-brown/10">
          <thead className="bg-walnut-brown/5 text-left text-xs font-bold text-walnut-brown uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Order Ref</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Qty</th>
              <th className="px-6 py-4">Agreed Price</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-walnut-brown/5 text-sm text-charcoal-text">
            {orders.map((ord) => {
              const formattedDate = new Date(ord.createdAt).toLocaleDateString(
                "en-KE",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              );

              // order.product is populated by the backend
              // (populate("product", "name listedPrice")) — it's an object, not an ID.
              const productName = ord.product?.name || "Product unavailable";

              return (
                <tr
                  key={ord._id}
                  className="hover:bg-walnut-brown/2 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-walnut-brown">
                    #{ord._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-charcoal-text">
                      {ord.customerName}
                    </div>
                    <div className="text-xs text-charcoal-text/50 font-medium">
                      {ord.customerPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium max-w-xs truncate">
                    {productName}
                  </td>
                  <td className="px-6 py-4 font-medium text-charcoal-text/70">
                    {ord.quantity}
                  </td>
                  <td className="px-6 py-4 font-extrabold text-walnut-brown">
                    {formatCurrency(ord.agreedPrice)}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-charcoal-text/60">
                    {ord.orderType}
                  </td>
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={ord.status} />
                  </td>
                  <td className="px-6 py-4 font-medium text-charcoal-text/60">
                    {formattedDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpenDetail(ord)}
                      icon={HiOutlineDocumentSearch}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
