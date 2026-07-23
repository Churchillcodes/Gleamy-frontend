import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaArrowRight,
  FaBaby,
  FaBoxes,
  FaChair,
  FaShieldAlt,
  FaHammer,
  FaPalette,
  FaComments,
} from "react-icons/fa";
import { productApi } from "../../api/productApi";
import ProductCard from "../../components/product/ProductCard";
import HeroCarousel from "../../components/home/HeroCarousel";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { generateWhatsAppLink } from "../../utils/whatsappLink";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [heroProducts, setHeroProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productApi.getAllProducts();
        // Take the first 3 active products as featured
        setFeaturedProducts(data.slice(0, 3));
        setHeroProducts(
          data.filter((p) => p.images && p.images.length > 0).slice(0, 5),
        );
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroInquiry = () => {
    const text =
      "Hi Gleamy Baby Cots & Furniture, I am interested in browsing your handmade beds and home cots. Can we discuss your catalog?";
    window.open(generateWhatsAppLink(text), "_blank", "noopener,noreferrer");
  };

  const categories = [
    {
      name: "Baby Furniture",
      desc: "Royal Baby Cots, Convertible Cribs & Toddler Wooden Beds.",
      icon: FaBaby,
      bg: "bg-amber-50",
    },
    {
      name: "Storage Furniture",
      desc: "Nursery Chest of Drawers, Cabinets & Premium Wooden Wardrobes.",
      icon: FaBoxes,
      bg: "bg-emerald-50",
    },
    {
      name: "Living Room Furniture",
      desc: "Elegant TV Stands, Custom Coffee Tables & Side Shelves.",
      icon: FaChair,
      bg: "bg-blue-50",
    },
  ];

  const trustBadges = [
    {
      icon: FaShieldAlt,
      title: "Nursery Safety First",
      desc: "Certified rounded corners, child-safe structural bars, and organic, non-toxic wood sealants.",
    },
    {
      icon: FaHammer,
      title: "Expert Nairobi Carpentry",
      desc: "Crafted by master carpenters at our Huruma Corner workshop using seasoned hardwoods.",
    },
    {
      icon: FaPalette,
      title: "Custom Paint & Sizes",
      desc: "Choose your desired color palettes, dimensions, and drawer layouts before production.",
    },
    {
      icon: FaComments,
      title: "Naomi & Ivan Support",
      desc: "Instant WhatsApp pricing negotiations, custom builds, and live assembly video feeds.",
    },
  ];

  const steps = [
    {
      num: "1",
      title: "Browse Catalogue",
      desc: "Explore our catalog of baby cots, wardrobes, and living room furniture.",
    },
    {
      num: "2",
      title: "WhatsApp Inquiry",
      desc: 'Click "Inquire" to deep-link straight to Ivan or Naomi with the product specifications.',
    },
    {
      num: "3",
      title: "Align & Deposit",
      desc: "Agree on the dimensions, colors, delivery terms, and make a standard deposit.",
    },
    {
      num: "4",
      title: "Build & Delivery",
      desc: "We craft your furniture and ship it directly to your home in Nairobi or across Kenya.",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Panel */}
      {heroProducts.length > 0 ? (
        <HeroCarousel products={heroProducts} />
      ) : (
        <section className="relative bg-walnut-brown text-warm-cream py-20 lg:py-28 overflow-hidden">
          {/* ...keep your existing static hero JSX here unchanged as the fallback...
    <section className="relative bg-walnut-brown text-warm-cream py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <Badge variant="sage" className="animate-pulse px-3 py-1 text-xs">
            Handcrafted Nursery Cots & Home Fitting
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Beautiful Wooden Furniture Built For Your Growing Family
          </h1>

          <p className="text-lg sm:text-xl text-warm-cream/80 max-w-2xl mx-auto font-medium leading-relaxed">
            From safety-first baby cots to custom wardrobes and living room
            fittings. Built by hand on Huruma Corner, Nairobi, Kenya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/catalogue">
              <Button
                size="lg"
                className="w-full sm:w-auto"
                icon={FaArrowRight}
              >
                Browse Catalogue
              </Button>
            </Link>
            <Button
              variant="whatsapp"
              size="lg"
              onClick={handleHeroInquiry}
              className="w-full sm:w-auto text-white shadow-xl hover:scale-103"
              icon={FaWhatsapp}
            >
              Consult Naomi & Ivan
            </Button>
          </div>
        </div>
      </section>
    */}
        </section>
      )}

      {/* 2. Category Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-walnut-brown">
            Shop by Category
          </h2>
          <p className="text-sm text-charcoal-text/75 font-medium">
            Browse our collections designed for nurseries, bedrooms, and living
            rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/catalogue?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col justify-between p-8 rounded-2xl border border-walnut-brown/10 bg-white hover:border-walnut-brown hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-xl inline-flex ${cat.bg} text-walnut-brown group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-walnut-brown">
                    {cat.name}
                  </h3>
                  <p className="text-charcoal-text/70 text-sm leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-1.5 text-xs font-bold text-walnut-brown uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-300">
                  Explore Collection <FaArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-walnut-brown/10 pb-4">
          <div>
            <h2 className="text-3xl font-extrabold text-walnut-brown">
              Featured Creations
            </h2>
            <p className="text-sm text-charcoal-text/70 font-medium">
              Our most popular designs for baby cribs, cabinets, and storage.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="text-xs font-bold text-walnut-brown uppercase tracking-wider flex items-center gap-1.5 hover:text-walnut-brown/70 transition-colors"
          >
            View All Products <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <Loader type="skeleton-grid" count={3} />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-charcoal-text/50 text-sm font-semibold uppercase">
            No products showcased at the moment.
          </div>
        )}
      </section>

      {/* 4. Why Choose Us */}
      <section className="bg-soft-sage/10 py-16 border-y border-walnut-brown/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-walnut-brown">
              Why Choose Gleamy
            </h2>
            <p className="text-sm text-charcoal-text/75 font-medium">
              We design with love, craft with precision, and communicate with
              transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-walnut-brown/5 text-center space-y-3.5 shadow-2xs"
                >
                  <div className="mx-auto w-12 h-12 rounded-xl bg-walnut-brown/5 text-walnut-brown flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading text-base font-bold text-walnut-brown">
                    {badge.title}
                  </h3>
                  <p className="text-charcoal-text/70 text-xs sm:text-sm leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-walnut-brown">
            How Ordering Works
          </h2>
          <p className="text-sm text-charcoal-text/75 font-medium">
            A seamless transition from digital browsing to professional WhatsApp
            coordination.
          </p>
        </div>

        <div className="relative">
          {/* Horizontal line for desktop */}
          <div className="hidden lg:block absolute top-8 left-16 right-16 h-0.5 bg-walnut-brown/10 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full bg-walnut-brown text-warm-cream flex items-center justify-center font-heading text-lg font-bold shadow-md">
                  {step.num}
                </div>
                <h3 className="font-heading text-base font-bold text-walnut-brown">
                  {step.title}
                </h3>
                <p className="text-charcoal-text/70 text-sm max-w-xs mx-auto leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-walnut-brown rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] bg-size-[16px_16px]" />

          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white max-w-2xl mx-auto">
            Ready to Start Customizing Your Nursery or Living Space?
          </h2>
          <p className="text-warm-cream/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Contact Naomi & Ivan directly on WhatsApp. Let us build furniture
            tailored exactly to your dimensions and home aesthetic.
          </p>
          <div className="pt-2 relative z-10">
            <Button
              variant="whatsapp"
              size="lg"
              onClick={handleHeroInquiry}
              className="text-white hover:scale-104"
              icon={FaWhatsapp}
            >
              Inquire via WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
