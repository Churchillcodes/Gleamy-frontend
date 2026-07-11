import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import OrderStatusBadge from "./OrderStatusBadge";
import { formatCurrency } from "../../utils/formatCurrency";
import { orderApi } from "../../api/orderApi";
import toast from "react-hot-toast";

// Mirrors the exact validTransitions object in the backend's orderController.js.
// Keeping this in sync with the backend means the UI never offers a transition
// the server would reject.
const TRANSITIONS_BY_TYPE = {
  "Inventory Sale": {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Ready", "Cancelled"],
    Ready: ["Delivered", "Cancelled"],
    Delivered: [],
    Cancelled: [],
  },
  "Custom Order": {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["In Production", "Cancelled"],
    "In Production": ["Ready"],
    Ready: ["Delivered"],
    Delivered: [],
    Cancelled: [],
  },
};

export default function OrderDetailModal({
  isOpen,
  onClose,
  order,
  onOrderUpdate,
}) {
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus("");
    }
  }, [order]);

  if (!order) return null;

  const {
    _id,
    customerName,
    customerPhone,
    customerLocation,
    product, // populated object: { _id, name, listedPrice } (backend: populate("product", "name listedPrice category"))
    quantity,
    listedPrice,
    agreedPrice,
    orderType, // "Custom Order" or "Inventory Sale"
    customRequirements,
    notes,
    createdAt,
    status: currentStatus,
  } = order;

  const transitions = TRANSITIONS_BY_TYPE[orderType] || {};
  const allowedNext = transitions[currentStatus] || [];

  // "Cancelled" is offered via its own dedicated button below, not the status dropdown
  const statusOptions = [
    {
      label: "Select next status...",
      value: "",
    },
    ...allowedNext
      .filter((s) => s !== "Cancelled")
      .map((s) => ({
        label: s,
        value: s,
      })),
  ];

  const canCancel = allowedNext.includes("Cancelled");
  const canChangeStatus = statusOptions.length > 0;
  const isFinalState = allowedNext.length === 0;

  const totalAmount = (quantity || 0) * (agreedPrice || 0);

  const handleUpdateStatus = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    setIsUpdating(true);
    const loadId = toast.loading("Updating order status...");
    try {
      const data = await orderApi.updateOrderStatus(_id, status);
      toast.success(`Order marked as ${status}.`, { id: loadId });
      if (onOrderUpdate) onOrderUpdate(data.order || data);
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update order status.",
        { id: loadId },
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (
      !confirm(
        "Are you sure you want to CANCEL this order? This action is permanent.",
      )
    )
      return;

    setIsUpdating(true);
    const loadId = toast.loading("Cancelling order...");
    try {
      const data = await orderApi.cancelOrder(_id);
      toast.success("Order has been cancelled.", { id: loadId });
      if (onOrderUpdate) onOrderUpdate(data.order || data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order.", {
        id: loadId,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-KE", {
    dateStyle: "medium",
  });

  const footerActions = (
    <div className="flex justify-between items-center w-full">
      {canCancel ? (
        <Button
          variant="danger"
          size="sm"
          onClick={handleCancelOrder}
          disabled={isUpdating}
        >
          Cancel Order
        </Button>
      ) : (
        <div />
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isUpdating}
        >
          Close
        </Button>
        {canChangeStatus && status !== currentStatus && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleUpdateStatus}
            isLoading={isUpdating}
          >
            Update Status
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Detail: #${_id.slice(-6).toUpperCase()}`}
      footerActions={footerActions}
      size="md"
    >
      <div className="space-y-6">
        {/* Top Status & Date */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-walnut-brown/5 p-4 rounded-xl border border-walnut-brown/10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-text/50 block">
              Created On
            </span>
            <span className="text-sm font-semibold text-walnut-brown">
              {formattedDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-text/50 block">
              Current Status
            </span>
            <OrderStatusBadge status={currentStatus} size="md" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-text/50 block">
              Order Classification
            </span>
            <span className="text-sm font-bold text-walnut-brown">
              {orderType}
            </span>
          </div>
        </div>

        {/* Two column breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-walnut-brown border-b border-walnut-brown/10 pb-1">
              Customer Contact
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-charcoal-text/60 font-medium">
                  Name:{" "}
                </span>
                <span className="font-bold text-charcoal-text">
                  {customerName}
                </span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">
                  Phone:{" "}
                </span>
                <span className="font-bold text-charcoal-text">
                  {customerPhone}
                </span>
              </div>
              {customerLocation && (
                <div>
                  <span className="text-charcoal-text/60 font-medium">
                    Location:{" "}
                  </span>
                  <span className="text-charcoal-text font-medium">
                    {customerLocation}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-walnut-brown border-b border-walnut-brown/10 pb-1">
              Ordered Product
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-charcoal-text/60 font-medium">
                  Name:{" "}
                </span>
                <span className="font-bold text-charcoal-text">
                  {product?.name || "Product unavailable"}
                </span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">
                  Quantity:{" "}
                </span>
                <span className="font-bold text-charcoal-text">{quantity}</span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">
                  Listed Price:{" "}
                </span>
                <span className="font-semibold text-charcoal-text/80">
                  {formatCurrency(listedPrice)}
                </span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">
                  Agreed Price:{" "}
                </span>
                <span className="font-extrabold text-walnut-brown">
                  {formatCurrency(agreedPrice)}{" "}
                  <span className="font-medium text-charcoal-text/50">
                    /unit
                  </span>
                </span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">
                  Total:{" "}
                </span>
                <span className="font-extrabold text-walnut-brown">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom requirements */}
        {customRequirements && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-walnut-brown border-b border-walnut-brown/10 pb-1">
              Custom Requirements
            </h4>
            <p className="text-sm text-charcoal-text/80 leading-relaxed bg-white p-3 rounded-lg border border-walnut-brown/10">
              {customRequirements}
            </p>
          </div>
        )}

        {/* Notes */}
        {notes && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-walnut-brown border-b border-walnut-brown/10 pb-1">
              Internal Admin Notes
            </h4>
            <p className="text-sm text-charcoal-text/80 leading-relaxed bg-white p-3 rounded-lg border border-walnut-brown/10 italic">
              "{notes}"
            </p>
          </div>
        )}

        {/* Status update actions */}
        {canChangeStatus && (
          <div className="pt-2 border-t border-walnut-brown/10">
            <Input
              type="select"
              label="Transition Order Status To:"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
            />
          </div>
        )}

        {isFinalState && (
          <div className="p-3 text-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-xs font-semibold">
            This order is in a final state ({currentStatus}) and cannot be
            transitioned further.
          </div>
        )}

        {!isFinalState && !canChangeStatus && !canCancel && (
          <div className="p-3 text-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 text-xs font-semibold">
            No further status changes are available for this order.
          </div>
        )}
      </div>
    </Modal>
  );
}
