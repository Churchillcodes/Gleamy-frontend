import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaArrowLeft,
  FaRulerCombined,
  FaPalette,
  FaTruck,
} from "react-icons/fa";
import { productApi } from "../../api/productApi";
import ProductGallery from "../../components/product/ProductGallery";
import ProductCard from "../../components/product/ProductCard";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { getProductInquiryLink } from "../../utils/whatsappLink";
import LeadModal from "../../components/common/LeadModal";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(false);
      try {
        const prod = await productApi.getProductById(id);
        setProduct(prod);

        // Fetch all products to get related items in same category
        const allProducts = await productApi.getAllProducts();
        const related = allProducts.filter(
          (p) => p.category === prod.category && p._id !== prod._id,
        );
        setRelatedProducts(related.slice(0, 3)); // Limit to 3 items
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loader type="skeleton-detail" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="text-red-500 bg-red-50 p-4 rounded-full inline-flex border border-red-200">
          <svg
            className="w-12 h-12 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-walnut-brown">
          Product Not Found
        </h2>
        <p className="text-charcoal-text/70 text-sm">
          The product you are looking for may have been archived or does not
          exist.
        </p>
        <Link to="/catalogue">
          <Button variant="outline" size="sm" icon={FaArrowLeft}>
            Back to Catalogue
          </Button>
        </Link>
      </div>
    );
  }

  const {
    name,
    category,
    description,
    listedPrice,
    negotiable,
    quantity,
    isMadeToOrder,
    dimensions,
    colors = [],
    images = [],
  } = product;

  // Rule 1: Negotiable pricing only applies to inventory items, never made-to-order.
  const showNegotiable = isMadeToOrder === false && negotiable === true;

  // Rule 3: Stock status indicator
  const isOutOfStock = isMadeToOrder === false && quantity === 0;
  const isInStock = isMadeToOrder === false && quantity > 0;

  const baseMessage = decodeURIComponent(
    getProductInquiryLink(product).split("text=")[1],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Back button */}
      <div>
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 text-xs font-bold text-walnut-brown uppercase tracking-wider hover:opacity-75 transition-opacity"
        >
          <FaArrowLeft /> Back to Catalogue
        </Link>
      </div>

      {/* Main product columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <ProductGallery images={images} productName={name} />

        {/* Right Column: Specifications & Inquiries */}
        <div className="space-y-6">
          <div className="space-y-3">
            {/* Category Tag & Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-walnut-brown text-warm-cream">
                {category}
              </span>

              {isMadeToOrder && (
                <Badge variant="sage" size="sm">
                  Made to Order
                </Badge>
              )}

              {isInStock && (
                <Badge variant="success" size="sm">
                  In Stock
                </Badge>
              )}

              {isOutOfStock && (
                <Badge variant="danger" size="sm">
                  Out of Stock
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-walnut-brown leading-tight">
              {name}
            </h1>

            {/* Pricing Row */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-walnut-brown">
                {formatCurrency(listedPrice)}
              </span>
              {showNegotiable && (
                <Badge variant="whatsapp" size="md">
                  Negotiable
                </Badge>
              )}
            </div>
          </div>

          <hr className="border-walnut-brown/10" />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-walnut-brown">
              Description
            </h3>
            <p className="text-charcoal-text/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Product Specifications (Dimensions & Colors) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Dimensions */}
            <div className="space-y-2 bg-walnut-brown/5 p-4 rounded-xl border border-walnut-brown/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-walnut-brown/65 flex items-center gap-1.5">
                <FaRulerCombined /> Dimensions (L &times; W &times; H)
              </span>
              <p className="text-xs sm:text-sm font-semibold text-charcoal-text mt-1">
                {dimensions &&
                dimensions.length &&
                dimensions.width &&
                dimensions.height
                  ? `${dimensions.length}cm × ${dimensions.width}cm × ${dimensions.height}cm`
                  : "Custom sizes available upon request"}
              </p>
            </div>

            {/* Colors */}
            <div className="space-y-2 bg-walnut-brown/5 p-4 rounded-xl border border-walnut-brown/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-walnut-brown/65 flex items-center gap-1.5">
                <FaPalette /> Color Finishes
              </span>
              <p className="text-xs sm:text-sm font-semibold text-charcoal-text mt-1">
                {colors && colors.length > 0
                  ? colors.join(", ")
                  : "White, Natural Pine, Mahogany, Sage Grey"}
              </p>
            </div>
          </div>

          {/* Trust Banner inside layout */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-soft-sage/10 text-walnut-brown border border-soft-sage/35 text-xs font-medium leading-relaxed">
            <FaTruck size={20} className="shrink-0 text-walnut-brown/60" />
            <span>
              Delivering across Nairobi & wider Kenya. We provide professional
              home assembly on arrival!
            </span>
          </div>

          {/* WhatsApp CTA Action */}
          <div className="pt-4">
            {/* Rule 4: Out-of-stock inventory items cannot be "bought" */}
            {isOutOfStock ? (
              <button
                disabled
                className="w-full py-4 px-6 rounded-2xl font-bold bg-gray-100 text-gray-400 border border-gray-200/50 cursor-not-allowed flex items-center justify-center gap-2"
              >
                Inquiries Closed (Out of Stock)
              </button>
            ) : (
              <button
                onClick={() => setLeadModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl font-bold bg-whatsapp-green hover:bg-whatsapp-green/95 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-99 transition-all flex items-center justify-center gap-2.5"
              >
                <FaWhatsapp size={14} />
                Inquire & Customize on WhatsApp
              </button>
            )}
            <p className="text-[10px] text-center text-charcoal-text/50 font-semibold uppercase tracking-wider mt-2.5">
              Clicking open will deep-link directly to Ivan & Naomi
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-walnut-brown/10">
          <h2 className="text-2xl font-extrabold text-walnut-brown">
            Related Creations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        baseMessage={baseMessage}
        product={product}
      />
    </div>
  );
}
