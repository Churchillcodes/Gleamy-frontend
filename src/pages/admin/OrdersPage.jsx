import React, { useState, useEffect } from 'react';
import { orderApi } from '../../api/orderApi';
import { productApi } from '../../api/productApi';
import { ORDER_STATUSES } from '../../utils/constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import OrderTable from '../../components/order/OrderTable';
import OrderDetailModal from '../../components/order/OrderDetailModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { HiPlus, HiSearch, HiOutlineClipboardList, HiOutlinePlusCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Create Order Form Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    productId: '',
    negotiatedPrice: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        orderApi.getAllOrders(),
        productApi.getAllProducts(), // Only active products can be ordered
      ]);
      
      // Sort orders by date descending
      const sorted = [...ordersData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
      setProducts(productsData);
    } catch (err) {
      toast.error('Failed to load orders or products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleOrderUpdate = () => {
    loadData();
  };

  // Form bindings
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Auto-fill listedPrice if product changes and price hasn't been set yet
    if (name === 'productId' && value) {
      const selected = products.find((p) => p._id === value);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          negotiatedPrice: selected.listedPrice.toString(),
        }));
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const errs = {};
    if (!formData.customerName.trim()) {
      errs.customerName = 'Please enter client name.';
    }

    // Kenyan phone format regex: ^(?:\+254|254|0)(7\d{8}|1\d{8})$
    const kenyanPhoneRegex = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
    if (!formData.customerPhone.trim()) {
      errs.customerPhone = 'Please enter client phone.';
    } else if (!kenyanPhoneRegex.test(formData.customerPhone.replace(/\s+/g, ''))) {
      errs.customerPhone = 'Please enter a valid Kenyan phone number (e.g. 0712345678).';
    }

    if (!formData.productId) {
      errs.productId = 'Please select a product.';
    }

    const priceNum = Number(formData.negotiatedPrice);
    if (!formData.negotiatedPrice || isNaN(priceNum) || priceNum <= 0) {
      errs.negotiatedPrice = 'Price must be a number greater than 0.';
    }

    // Stock check for inventory products
    if (formData.productId) {
      const selected = products.find((p) => p._id === formData.productId);
      if (selected && !selected.isMadeToOrder && selected.quantity <= 0) {
        errs.productId = `This inventory item is Out of Stock (${selected.quantity} available). Stock must be added before checkout.`;
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadId = toast.loading('Creating order...');

    const payload = {
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim().replace(/\s+/g, ''),
      customerEmail: formData.customerEmail.trim() || undefined,
      productId: formData.productId,
      negotiatedPrice: Number(formData.negotiatedPrice),
      notes: formData.notes.trim() || undefined,
    };

    try {
      await orderApi.createOrder(payload);
      toast.success('Order logged successfully!', { id: loadId });
      setCreateOpen(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        productId: '',
        negotiatedPrice: '',
        notes: '',
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order.', { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client side filtering
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery) ||
      (ord.orderNumber && ord.orderNumber.toString().includes(searchQuery)) ||
      ord.productId?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = selectedStatus ? ord.status === selectedStatus : true;
    
    return matchesSearch && matchesStatus;
  });

  const productOptions = products.map((p) => {
    const suffix = p.isMadeToOrder ? ' (Made to Order)' : ` (Qty: ${p.quantity} - KSh ${p.listedPrice})`;
    return {
      label: `${p.name}${suffix}`,
      value: p._id,
    };
  });

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-walnut-brown leading-tight">
            Customer Inquiries & Orders
          </h1>
          <p className="text-xs text-charcoal-text/50 font-medium">Log new inquiries, adjust statuses, and coordinate production.</p>
        </div>
        
        <Button onClick={() => setCreateOpen(true)} icon={HiPlus}>
          Log Manual Order
        </Button>
      </div>

      {/* Control panel filters */}
      <div className="bg-white p-4 rounded-2xl border border-walnut-brown/10 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-charcoal-text/40">
            <HiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search name, phone, order no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-walnut-brown/15 bg-warm-cream/20 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut-brown/20 focus:border-walnut-brown w-full"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-walnut-brown/15 bg-white text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-walnut-brown/20 w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

      </div>

      {/* Main Order Table Grid */}
      {loading ? (
        <Loader type="spinner" className="min-h-[40vh]" />
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-charcoal-text/50 uppercase tracking-wider pl-1">
            Total of {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} logged
          </div>
          <OrderTable orders={filteredOrders} onOpenDetail={handleOpenDetail} />
        </div>
      ) : (
        <EmptyState
          title="No orders match filters"
          description="Try removing your search query or selecting a different status filter."
        />
      )}

      {/* Order Detail Modal */}
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

      {/* Create Order Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Log Manual Order"
        size="md"
      >
        <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
          <div className="p-3 bg-walnut-brown/5 rounded-xl border border-walnut-brown/10 text-xs text-walnut-brown font-medium leading-relaxed">
            Please log orders here only after aligning on pricing, colors, and delivery details in your WhatsApp deep conversation.
          </div>

          <Input
            label="Client Full Name"
            name="customerName"
            placeholder="e.g. John Kamau"
            value={formData.customerName}
            onChange={handleInputChange}
            error={formErrors.customerName}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kenyan Phone Number"
              name="customerPhone"
              placeholder="e.g. 0712345678"
              value={formData.customerPhone}
              onChange={handleInputChange}
              error={formErrors.customerPhone}
              required
            />

            <Input
              label="Client Email (Optional)"
              name="customerEmail"
              placeholder="e.g. client@gmail.com"
              value={formData.customerEmail}
              onChange={handleInputChange}
            />
          </div>

          <Input
            type="select"
            label="Select Purchased Product"
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            options={productOptions}
            placeholder="Choose product"
            error={formErrors.productId}
            required
          />

          <Input
            label="Negotiated Final Price (KSh)"
            name="negotiatedPrice"
            type="number"
            placeholder="e.g. 32000"
            value={formData.negotiatedPrice}
            onChange={handleInputChange}
            error={formErrors.negotiatedPrice}
            required
          />

          <Input
            type="textarea"
            label="Internal Coordination Notes (Optional)"
            name="notes"
            placeholder="Colors selected, deposit references, special delivery requests..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Log Order
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
