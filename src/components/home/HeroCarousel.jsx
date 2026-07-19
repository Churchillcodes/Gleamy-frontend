import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaArrowRight } from "react-icons/fa";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  getProductInquiryLink,
  generateWhatsAppLink,
} from "../../utils/whatsappLink";

const ROTATE_INTERVAL = 12000;

export default function HeroCarousel({ products = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (products.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [products.length, isPaused]);

  useEffect(() => {
    if (activeIndex >= products.length) {
      setActiveIndex(0);
    }
  }, [products.length, activeIndex]);

  if (products.length === 0) return null;

  const activeProduct = products[activeIndex];
  const imageUrl = activeProduct.images?.[0]?.url;

  const handleInquiry = () => {
    const link = getProductInquiryLink(activeProduct);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleGenericInquiry = () => {
    const text =
      "Hi Gleamy Baby Cots & Furniture, I visited your website and would like to consult about your baby cots and furniture.";

    window.open(generateWhatsAppLink(text), "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="relative overflow-hidden bg-walnut-brown text-warm-cream flex items-center py-10 sm:py-16 lg:py-0 lg:min-h-[calc(100vh-5rem)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-walnut-brown via-walnut-brown to-[#5f4132]" />

      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-5 lg:space-y-4 text-center lg:text-left">
            <Badge variant="sage" className="px-3 py-1 text-xs">
              Handcrafted Nursery Cots & Home Fitting
            </Badge>

            <h1 className="text-3xl sm:text-5xl lg:text-3xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Beautiful Wooden Furniture Built For Your Growing Family
            </h1>

            <p className="text-lg sm:text-xl lg:text-lg xl:text-xl text-warm-cream/80 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              From safety-first baby cots to custom wardrobes and living room
              fittings. Built by hand on Ngong Road, Nairobi, Kenya.
            </p>

            {/* Active Product Info */}
            <div className="hidden lg:block pt-1 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-soft-sage">
                {activeProduct.category}
              </span>

              <Link to={`/products/${activeProduct._id}`}>
                <h2 className="text-2xl xl:text-3xl font-bold text-white hover:text-soft-sage transition-colors">
                  {activeProduct.name}
                </h2>
              </Link>

              <p className="text-xl xl:text-2xl font-extrabold text-white">
                {formatCurrency(activeProduct.listedPrice)}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link to="/catalogue">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  icon={FaArrowRight}
                >
                  Browse Catalogue
                </Button>
              </Link>

              <div className="lg:hidden">
                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={handleGenericInquiry}
                  className="w-full sm:w-auto text-white shadow-xl"
                  icon={FaWhatsapp}
                >
                  Consult Naomi & Ivan
                </Button>
              </div>

              <div className="hidden lg:block">
                <Button
                  variant="whatsapp"
                  size="lg"
                  onClick={handleInquiry}
                  className="w-full sm:w-auto text-white shadow-xl"
                  icon={FaWhatsapp}
                >
                  Inquire About This Piece
                </Button>
              </div>
            </div>

            {/* Dots */}
            {products.length > 1 && (
              <div className="hidden lg:flex justify-center lg:justify-start gap-2 pt-3">
                {products.map((p, idx) => (
                  <button
                    key={p._id}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Show ${p.name}`}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex
                        ? "w-8 bg-white"
                        : "w-2 bg-white/35 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex relative lg:max-w-xl lg:ml-auto items-center">
            <Link to={`/products/${activeProduct._id}`} className="w-full">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl group h-[clamp(380px,60vh,580px)]">
                {/* Counter */}
                <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold">
                  {activeIndex + 1} / {products.length}
                </div>

                {imageUrl ? (
                  <img
                    key={activeProduct._id}
                    src={imageUrl}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 animate-[fadeIn_0.6s_ease-in-out]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-warm-cream/50 font-semibold uppercase">
                    No Image Available
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <span className="text-soft-sage text-xs font-bold uppercase tracking-wider">
                    {activeProduct.category}
                  </span>

                  <h3 className="text-white text-xl sm:text-2xl font-bold mt-1">
                    {activeProduct.name}
                  </h3>

                  <p className="text-white/90 font-semibold mt-1">
                    {formatCurrency(activeProduct.listedPrice)}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
