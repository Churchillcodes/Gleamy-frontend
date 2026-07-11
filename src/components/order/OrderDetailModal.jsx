import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import OrderStatusBadge from './OrderStatusBadge';
import { formatCurrency } from '../../utils/formatCurrency';
import { orderApi } from '../../api/orderApi';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function OrderDetailModal({ isOpen, onClose, order, onOrderUpdate }) {
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (!order) return null;

  const {
    _id,
    orderNumber,
    customerName,
    customerPhone,
    customerEmail,
    productId, // product object is populated, or contains fields like name, listedPrice
    negotiatedPrice,
    orderType, // "Custom Order" or "Inventory Sale"
    notes,
    createdAt,
    status: currentStatus,
  } = order;

  const isFinalState = currentStatus === 'Delivered' || currentStatus === 'Cancelled';

  // Rule 2.3: Inventory sales cannot move to "In Production"
  const filteredStatuses = ORDER_STATUSES.filter((st) => {
    if (orderType === 'Inventory Sale' && st === 'In Production') {
      return false;
    }
    // Cancelled status is managed via dedicated Cancel action
    if (st === 'Cancelled') return false;
    return true;
  });

  const statusOptions = filteredStatuses.map((st) => ({
    label: st,
    value: st,
  }));

  const handleUpdateStatus = async () => {
    if (status === currentStatus) {
      toast.error('Please choose a different status to update.');
      return;
    }

    setIsUpdating(true);
    const loadId = toast.loading('Updating order status...');
    try {
      const updatedOrder = await orderApi.updateOrderStatus(_id, status);
      toast.success(`Order marked as ${status}.`, { id: loadId });
      if (onOrderUpdate) onOrderUpdate(updatedOrder);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status.', { id: loadId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to CANCEL this order? This action is permanent.')) return;

    setIsUpdating(true);
    const loadId = toast.loading('Cancelling order...');
    try {
      const updatedOrder = await orderApi.cancelOrder(_id);
      toast.success('Order has been cancelled.', { id: loadId });
      if (onOrderUpdate) onOrderUpdate(updatedOrder);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.', { id: loadId });
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString('en-KE', {
    dateStyle: 'medium',
  });

  const footerActions = (
    <div className="flex justify-between items-center w-full">
      {/* Cancel Action */}
      {!isFinalState ? (
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

      {/* Save Action */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isUpdating}>
          Close
        </Button>
        {!isFinalState && status !== currentStatus && (
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
      title={`Order Detail: #${orderNumber || _id.substring(18)}`}
      footerActions={footerActions}
      size="md"
    >
      <div className="space-y-6">
        
        {/* Top Status & Date */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-walnut-brown/5 p-4 rounded-xl border border-walnut-brown/10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-text/50 block">Created On</span>
            <span className="text-sm font-semibold text-walnut-brown">{formattedDate}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-text/50 block">Current Status</span>
            <OrderStatusBadge status={currentStatus} size="md" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-text/50 block">Order Classification</span>
            <span className="text-sm font-bold text-walnut-brown">{orderType}</span>
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
                <span className="text-charcoal-text/60 font-medium">Name: </span>
                <span className="font-bold text-charcoal-text">{customerName}</span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">Phone: </span>
                <span className="font-bold text-charcoal-text">{customerPhone}</span>
              </div>
              {customerEmail && (
                <div>
                  <span className="text-charcoal-text/60 font-medium">Email: </span>
                  <span className="text-charcoal-text font-medium">{customerEmail}</span>
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
                <span className="text-charcoal-text/60 font-medium">Name: </span>
                <span className="font-bold text-charcoal-text">{productId?.name || 'Unknown Product'}</span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">Price Paid: </span>
                <span className="font-extrabold text-walnut-brown">{formatCurrency(negotiatedPrice)}</span>
              </div>
              <div>
                <span className="text-charcoal-text/60 font-medium">Class: </span>
                <span className="font-semibold text-charcoal-text/80">{productId?.category || 'Baby Nursery'}</span>
              </div>
            </div>
          </div>
        </div>

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
        {!isFinalState && (
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
            This order is in a final state ({currentStatus}) and cannot be transitioned.
          </div>
        )}

      </div>
    </Modal>
  );
}
