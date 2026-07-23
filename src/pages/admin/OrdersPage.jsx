import React, { useState, useEffect } from "react";
import { orderApi } from "../../api/orderApi";
import { productApi } from "../../api/productApi";
import { ORDER_STATUSES } from "../../utils/constants";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import OrderTable from "../../components/order/OrderTable";
import OrderDetailModal from "../../components/order/OrderDetailModal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { HiPlus, HiSearch } from "react-icons/hi";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Create Order Form Modal
  const [createOpen, setCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NOTE: field names below intentionally mirror the real Order schema
  // (customerName, customerPhone, customerLocation, product, quantity, agreedPrice, notes)
  // There is NO customerEmail field on the backend — removed entirely.
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerLocation: "",
    product: "",
    quantity: 1,
    agreedPrice: "",
    customRequirements: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        orderApi.getAllOrders(),
        productApi.getAllProducts(), // Only active products can be ordered
      ]);

      const sorted = [...ordersData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setOrders(sorted);
      setProducts(productsData);
    } catch (err) {
      toast.error("Failed to load orders or products.");
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

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerPhone: "",
      customerLocation: "",
      product: "",
      quantity: 1,
      agreedPrice: "",
      customRequirements: "",
      notes: "",
    });
    setFormErrors({});
  };

  const selectedProduct = products.find((p) => p._id === formData.product);

  // Form bindings
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Auto-fill agreedPrice as a starting suggestion when product changes
    // (admin can still edit it after negotiating on WhatsApp)
    if (name === "product" && value) {
      const selected = products.find((p) => p._id === value);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          agreedPrice: selected.listedPrice.toString(),
          quantity: 1,
        }));
      }
    }
  };

  // Form validation
  const validateForm = () => {
    const errs = {};
    if (!formData.customerName.trim()) {
      errs.customerName = "Please enter client name.";
    }

    const kenyanPhoneRegex = /^(?:\+254|254|0)(7\d{8}|1\d{8})$/;
    if (!formData.customerPhone.trim()) {
      errs.customerPhone = "Please enter client phone.";
    } else if (
      !kenyanPhoneRegex.test(formData.customerPhone.replace(/\s+/g, ""))
    ) {
      errs.customerPhone =
        "Please enter a valid Kenyan phone number (e.g. 0712345678).";
    }

    if (!formData.product) {
      errs.product = "Please select a product.";
    }

    const qtyNum = Number(formData.quantity);
    if (!formData.quantity || isNaN(qtyNum) || qtyNum < 1) {
      errs.quantity = "Quantity must be at least 1.";
    }

    const priceNum = Number(formData.agreedPrice);
    if (!formData.agreedPrice || isNaN(priceNum) || priceNum <= 0) {
      errs.agreedPrice = "Agreed price must be a number greater than 0.";
    }

    // Stock check for inventory products — mirrors backend's own check,
    // so the admin sees the problem before submitting, not after a 400.
    if (formData.product && selectedProduct) {
      if (!selectedProduct.isMadeToOrder && qtyNum > selectedProduct.quantity) {
        errs.quantity = `Only ${selectedProduct.quantity} in stock for this item.`;
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadId = toast.loading("Creating order...");

    // Payload matches the real Order schema exactly:
    // customerName, customerPhone, customerLocation, product, quantity,
    // listedPrice, agreedPrice, customRequirements, notes.
    // listedPrice is derived from the selected product, not user-entered,
    // since it represents the product's catalogue price at time of order.
    const payload = {
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim().replace(/\s+/g, ""),
      customerLocation: formData.customerLocation.trim() || undefined,
      product: formData.product,
      quantity: Number(formData.quantity),
      listedPrice: selectedProduct?.listedPrice,
      agreedPrice: Number(formData.agreedPrice),
      customRequirements: formData.customRequirements.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    try {
      await orderApi.createOrder(payload);
      toast.success("Order logged successfully!", { id: loadId });
      setCreateOpen(false);
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order.", {
        id: loadId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client side filtering — order.product is populated by the backend
  // (populate("product", "name listedPrice")), so it's an object, not an ID string.
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery) ||
      (ord.product?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus ? ord.status === selectedStatus : true;

    return matchesSearch && matchesStatus;
  });

  const productOptions = products.map((p) => {
    const suffix = p.isMadeToOrder
      ? " (Made to Order)"
      : ` (Qty: ${p.quantity} - KSh ${p.listedPrice})`;
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
          <p className="text-xs text-charcoal-text/50 font-medium">
            Log new inquiries, adjust statuses, and coordinate production.
          </p>
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
            placeholder="Search name, phone, product..."
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
            Total of {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""} logged
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
            Please log orders here only after aligning on pricing, colors, and
            delivery details in your WhatsApp conversation.
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
              label="Delivery Location (Optional)"
              name="customerLocation"
              placeholder="e.g. Huruma Corner, Nairobi"
              value={formData.customerLocation}
              onChange={handleInputChange}
            />
          </div>

          <Input
            type="select"
            label="Select Purchased Product"
            name="product"
            value={formData.product}
            onChange={handleInputChange}
            options={productOptions}
            placeholder="Choose product"
            error={formErrors.product}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              error={formErrors.quantity}
              required
            />

            <Input
              label="Agreed Price (KSh, per unit)"
              name="agreedPrice"
              type="number"
              placeholder="e.g. 32000"
              value={formData.agreedPrice}
              onChange={handleInputChange}
              error={formErrors.agreedPrice}
              required
            />
          </div>

          {selectedProduct && (
            <p className="text-[11px] text-charcoal-text/50 font-medium -mt-2">
              Listed price: {formatCurrency(selectedProduct.listedPrice)}
              {!selectedProduct.isMadeToOrder &&
                ` · ${selectedProduct.quantity} in stock`}
            </p>
          )}

          {selectedProduct?.isMadeToOrder && (
            <Input
              type="textarea"
              label="Custom Requirements (Optional)"
              name="customRequirements"
              placeholder="Custom color, dimensions, or design changes agreed on WhatsApp..."
              value={formData.customRequirements}
              onChange={handleInputChange}
              rows={2}
            />
          )}

          <Input
            type="textarea"
            label="Internal Notes (Optional)"
            name="notes"
            placeholder="Deposit reference, special delivery requests..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Log Order
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
