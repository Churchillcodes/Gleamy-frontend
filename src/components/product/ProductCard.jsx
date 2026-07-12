import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaEye } from "react-icons/fa";
import Badge from "../common/Badge";
import { formatCurrency } from "../../utils/formatCurrency";
import { getProductInquiryLink } from "../../utils/whatsappLink";
import LeadModal from "../common/LeadModal";

export default function ProductCard({ product }) {
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const {
    _id,
    name,
    category,
    listedPrice,
    negotiable,
    quantity,
    isMadeToOrder,
    images = [],
  } = product;

  // Rule 1: Negotiable pricing only applies to inventory items, never made-to-order.
  const showNegotiable = isMadeToOrder === false && negotiable === true;

  // Rule 3: Stock status indicator
  const isOutOfStock = isMadeToOrder === false && quantity === 0;
  const isInStock = isMadeToOrder === false && quantity > 0;

  const imageUrl = images.length > 0 ? images[0].url : null;
  const baseMessage = decodeURIComponent(
    getProductInquiryLink(product).split("text=")[1],
  );

  return (
    <>
      <div className="group bg-white rounded-2xl border border-walnut-brown/10 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
        {/* Product Image Panel */}
        <Link
          to={`/products/${_id}`}
          className="block relative aspect-4/3 bg-walnut-brown/5 overflow-hidden"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-walnut-brown/30 p-4">
              <svg
                className="w-12 h-12 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider mt-2">
                No Image Available
              </span>
            </div>
          )}

          {/* Categories / Tags overlays */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-walnut-brown text-warm-cream">
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
        </Link>

        {/* Details Box */}
        <div className="p-5 grow flex flex-col justify-between">
          <div className="space-y-1.5">
            <Link to={`/products/${_id}`} className="block">
              <h3 className="font-heading text-base font-bold text-walnut-brown line-clamp-1 group-hover:text-walnut-brown/85 transition-colors">
                {name}
              </h3>
            </Link>

            {/* Pricing Row */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-walnut-brown">
                {formatCurrency(listedPrice)}
              </span>
              {showNegotiable && (
                <Badge variant="whatsapp" size="sm">
                  Negotiable
                </Badge>
              )}
            </div>
          </div>

          {/* Actions panel */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {/* View details */}
            <Link
              to={`/products/${_id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-walnut-brown/25 text-walnut-brown hover:bg-walnut-brown/5 active:scale-98 transition-all"
            >
              <FaEye />
              Details
            </Link>

            {/* WhatsApp Enquiry CTA */}
            {isOutOfStock ? (
              <button
                disabled
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                title="Out of stock items cannot be ordered"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={() => setLeadModalOpen(true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-whatsapp-green text-white hover:bg-whatsapp-green/90 active:scale-98 transition-all shadow-xs hover:shadow-md"
              >
                <FaWhatsapp size={14} />
                Inquire
              </button>
            )}
          </div>
        </div>
      </div>
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        baseMessage={baseMessage}
        product={product}
      />
    </>
  );
}
