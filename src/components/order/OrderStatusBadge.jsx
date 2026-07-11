import React from 'react';
import Badge from '../common/Badge';

export default function OrderStatusBadge({ status, size = 'sm' }) {
  const statusConfig = {
    Pending: { variant: 'warning', label: 'Pending' },
    Confirmed: { variant: 'info', label: 'Confirmed' },
    'In Production': { variant: 'walnut', label: 'In Production' },
    Ready: { variant: 'sage', label: 'Ready for Pickup' },
    Delivered: { variant: 'success', label: 'Delivered' },
    Cancelled: { variant: 'danger', label: 'Cancelled' },
  };

  const config = statusConfig[status] || { variant: 'walnut', label: status };

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
