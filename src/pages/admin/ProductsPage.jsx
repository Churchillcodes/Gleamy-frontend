import React, { useState, useEffect } from 'react';
import { productApi } from '../../api/productApi';
import { CATEGORIES } from '../../utils/constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import ImageUploader from '../../components/product/ImageUploader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatCurrency';
import { HiPlus, HiSearch, HiTrash, HiRefresh, HiPlusCircle, HiMinusCircle, HiArchive, HiPencil } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal State
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    listedPrice: '',
    negotiable: true,
    quantity: 0,
    isMadeToOrder: true,
    length: '',
    width: '',
    height: '',
    colorsInput: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const loadProducts = async () => {
    setLoading(true);
    try {
      let data = [];
      if (showArchived) {
        data = await productApi.getArchivedProducts();
      } else {
        data = await productApi.getAllProducts();
      }
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products list.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [showArchived]);

  // Form bindings
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: CATEGORIES[0],
      description: '',
      listedPrice: '',
      negotiable: true,
      quantity: 0,
      isMadeToOrder: true,
      length: '',
      width: '',
      height: '',
      colorsInput: '',
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      listedPrice: product.listedPrice,
      negotiable: product.negotiable ?? true,
      quantity: product.quantity ?? 0,
      isMadeToOrder: product.isMadeToOrder ?? true,
      length: product.dimensions?.length ?? '',
      width: product.dimensions?.width ?? '',
      height: product.dimensions?.height ?? '',
      colorsInput: product.colors ? product.colors.join(', ') : '',
    });
    setFormErrors({});
    setFormOpen(true);
  };

  // Stock Adjustment inline
  const handleAdjustStock = async (id, delta) => {
    try {
      if (delta > 0) {
        const updated = await productApi.increaseStock(id, delta);
        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        toast.success(`Stock increased.`);
      } else if (delta < 0) {
        const updated = await productApi.reduceStock(id, Math.abs(delta));
        setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
        toast.success(`Stock reduced.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Insufficent stock or adjustment failed.');
    }
  };

  // Archive / Soft Delete
  const handleArchive = async (id) => {
    if (!confirm('Are you sure you want to ARCHIVE this product? It will not appear on the shopfront.')) return;
    try {
      await productApi.archiveProduct(id);
      toast.success('Product archived.');
      loadProducts();
    } catch (err) {
      toast.error('Failed to archive product.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await productApi.restoreProduct(id);
      toast.success('Product restored to active catalog.');
      loadProducts();
    } catch (err) {
      toast.error('Failed to restore product.');
    }
  };

  // Form Validation
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.length < 3 || formData.name.length > 100) {
      errs.name = 'Name must be between 3 and 100 characters.';
    }
    if (!formData.description.trim() || formData.description.length < 10 || formData.description.length > 1000) {
      errs.description = 'Description must be between 10 and 1000 characters.';
    }
    const priceNum = Number(formData.listedPrice);
    if (!formData.listedPrice || isNaN(priceNum) || priceNum <= 0) {
      errs.listedPrice = 'Listed price must be a number greater than 0.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const loadId = toast.loading('Saving product...');

    // Format colors and dimensions
    const colors = formData.colorsInput
      ? formData.colorsInput.split(',').map((c) => c.trim()).filter(Boolean)
      : [];

    const dimensions = {
      length: formData.length ? Number(formData.length) : undefined,
      width: formData.width ? Number(formData.width) : undefined,
      height: formData.height ? Number(formData.height) : undefined,
    };

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      listedPrice: Number(formData.listedPrice),
      negotiable: formData.isMadeToOrder ? false : formData.negotiable, // Rule 1 enforce
      quantity: formData.isMadeToOrder ? 0 : Number(formData.quantity), // Made to order holds 0 stock
      isMadeToOrder: formData.isMadeToOrder,
      dimensions,
      colors,
    };

    try {
      if (editingProduct) {
        const updated = await productApi.updateProduct(editingProduct._id, payload);
        toast.success('Product updated successfully!', { id: loadId });
        setFormOpen(false);
        loadProducts();
      } else {
        const created = await productApi.createProduct(payload);
        toast.success('Product created! Keep editing to upload images.', { id: loadId });
        // Automatically switch to editing mode for image uploads!
        setEditingProduct(created);
        setFormData((prev) => ({
          ...prev,
          quantity: created.quantity,
        }));
        loadProducts();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product draft.';
      toast.error(msg, { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image upload triggers
  const handleImageChange = (updatedProduct) => {
    setEditingProduct(updatedProduct);
    loadProducts();
  };

  // Client-side search filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-walnut-brown leading-tight">
            Manage Products
          </h1>
          <p className="text-xs text-charcoal-text/50 font-medium">Add, update, and manage baby cots, wardrobes, and living room cots.</p>
        </div>
        
        <Button onClick={handleOpenCreateModal} icon={HiPlus}>
          Add New Product
        </Button>
      </div>

      {/* Control panel bar */}
      <div className="bg-white p-4 rounded-2xl border border-walnut-brown/10 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search & Category selectors */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-charcoal-text/40">
              <HiSearch size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-walnut-brown/15 bg-warm-cream/20 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-walnut-brown/20 focus:border-walnut-brown w-full sm:w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-walnut-brown/15 bg-white text-xs sm:text-sm rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-walnut-brown/20"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* View toggle active/archived */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !showArchived
                ? 'bg-walnut-brown text-warm-cream shadow-sm'
                : 'text-charcoal-text/60 hover:bg-walnut-brown/5'
            }`}
          >
            Active Catalog
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              showArchived
                ? 'bg-walnut-brown text-warm-cream shadow-sm'
                : 'text-charcoal-text/60 hover:bg-walnut-brown/5'
            }`}
          >
            Archived Drafts
          </button>
        </div>

      </div>

      {/* Grid of Products */}
      {loading ? (
        <Loader type="spinner" className="min-h-[40vh]" />
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const hasImages = p.images && p.images.length > 0;
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-walnut-brown/12 p-5 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  {/* Image & Type tags */}
                  <div className="relative aspect-[16/10] bg-walnut-brown/5 rounded-xl overflow-hidden mb-4 border border-walnut-brown/5">
                    {hasImages ? (
                      <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-walnut-brown/20 text-xs font-semibold">
                        No Images
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <Badge variant="walnut" size="sm">
                        {p.category}
                      </Badge>
                      {p.isMadeToOrder ? (
                        <Badge variant="sage" size="sm">Made to Order</Badge>
                      ) : (
                        <Badge variant="success" size="sm">Inventory Sale</Badge>
                      )}
                    </div>
                  </div>

                  {/* Name and Price */}
                  <div className="space-y-1">
                    <h3 className="font-heading text-base font-bold text-walnut-brown truncate">{p.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-walnut-brown">
                        {formatCurrency(p.listedPrice)}
                      </span>
                      {!p.isMadeToOrder && p.negotiable && (
                        <Badge variant="whatsapp" size="sm">Negotiable</Badge>
                      )}
                    </div>
                  </div>

                  {/* Stock Management panel */}
                  {!p.isMadeToOrder ? (
                    <div className="mt-4 flex items-center justify-between bg-warm-cream/35 p-2.5 rounded-xl border border-walnut-brown/5">
                      <span className="text-[10px] font-bold text-walnut-brown/60 uppercase">In Stock:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p._id, -1)}
                          disabled={p.quantity <= 0}
                          className="text-walnut-brown hover:text-red-600 disabled:opacity-30 cursor-pointer"
                          title="Reduce stock by 1"
                        >
                          <HiMinusCircle size={22} />
                        </button>
                        <span className="font-bold text-sm w-6 text-center text-walnut-brown">{p.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p._id, 1)}
                          className="text-walnut-brown hover:text-emerald-600 cursor-pointer"
                          title="Increase stock by 1"
                        >
                          <HiPlusCircle size={22} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 text-[10px] uppercase font-bold text-charcoal-text/50 p-2.5 bg-gray-50 text-center rounded-xl border border-gray-150">
                      No stock count (Built Custom)
                    </div>
                  )}
                </div>

                {/* Edit & Soft Delete Action buttons */}
                <div className="mt-5 pt-3 border-t border-walnut-brown/5 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditModal(p)}
                    icon={HiPencil}
                  >
                    Edit Item
                  </Button>

                  {p.isActive ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleArchive(p._id)}
                      icon={HiArchive}
                      className="text-red-700 hover:bg-red-50 hover:border-red-200"
                    >
                      Archive
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRestore(p._id)}
                      icon={HiRefresh}
                    >
                      Restore
                    </Button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No products logged"
          description="Click the Add New Product button above to log cots drafts to your inventory dashboard."
        />
      )}

      {/* Add / Edit Drawer Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Log New Furniture Item'}
        size="lg"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Form controls */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <Input
              label="Product Name"
              name="name"
              placeholder="e.g. Convertible Nursery Cot"
              value={formData.name}
              onChange={handleInputChange}
              error={formErrors.name}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="select"
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                required
              />

              <Input
                label="Listed Price (KSh)"
                name="listedPrice"
                type="number"
                placeholder="e.g. 35000"
                value={formData.listedPrice}
                onChange={handleInputChange}
                error={formErrors.listedPrice}
                required
              />
            </div>

            <div className="flex gap-4 items-center bg-walnut-brown/5 p-3.5 rounded-xl border border-walnut-brown/5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-walnut-brown">
                <input
                  type="checkbox"
                  name="isMadeToOrder"
                  checked={formData.isMadeToOrder}
                  onChange={handleInputChange}
                  className="rounded border-walnut-brown/30 text-walnut-brown focus:ring-walnut-brown/40 w-4 h-4 cursor-pointer"
                />
                Made to Order (Built on Demand)
              </label>

              {!formData.isMadeToOrder && (
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-walnut-brown">
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleInputChange}
                    className="rounded border-walnut-brown/30 text-walnut-brown focus:ring-walnut-brown/40 w-4 h-4 cursor-pointer"
                  />
                  Price Negotiable
                </label>
              )}
            </div>

            {!formData.isMadeToOrder && (
              <Input
                label="Starting Stock Quantity"
                name="quantity"
                type="number"
                placeholder="e.g. 5"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            )}

            <Input
              type="textarea"
              label="Detailed Description"
              name="description"
              placeholder="Wood species, durability details, nursery spacing..."
              value={formData.description}
              onChange={handleInputChange}
              error={formErrors.description}
              rows={3}
              required
            />

            {/* Dimensions */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-walnut-brown tracking-wide block">
                Dimensions (cm, Optional)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="L"
                  name="length"
                  type="number"
                  value={formData.length}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="W"
                  name="width"
                  type="number"
                  value={formData.width}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="H"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Input
              label="Color Options (Comma separated, e.g. Cream, Walnut, Sage)"
              name="colorsInput"
              placeholder="Natural Pine, White, Espresso"
              value={formData.colorsInput}
              onChange={handleInputChange}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                Save Product
              </Button>
            </div>
          </form>

          {/* Right Image Drag/Drop Uploader */}
          <div className="bg-warm-cream/35 p-5 rounded-2xl border border-walnut-brown/10 min-h-[300px]">
            {editingProduct ? (
              <ImageUploader
                product={editingProduct}
                onUploadSuccess={handleImageChange}
                onDeleteSuccess={handleImageChange}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-charcoal-text/50">
                <svg className="w-12 h-12 stroke-current mb-3 opacity-60" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="font-heading text-sm font-bold text-walnut-brown">Image Uploader Blocked</h4>
                <p className="text-xs leading-relaxed mt-1">
                  You must save the base product specifications once before you can drag and drop media files.
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
