import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../../api/productApi";
import ProductGrid from "../../components/product/ProductGrid";
import ProductFilters from "../../components/product/ProductFilters";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Load all active products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching catalogue products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort client-side based on URLSearchParams change
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const productType = searchParams.get("productType") || "";
    const sortBy = searchParams.get("sortBy") || "featured";

    let result = [...products];

    // 1. Search Query Filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    // 2. Category Filter
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    // Product Type Filter
    if (productType) {
      result = result.filter((p) => p.productType === productType);
    }

    // 3. Availability Type Filter
    if (type === "inventory") {
      result = result.filter((p) => p.isMadeToOrder === false);
    } else if (type === "custom") {
      result = result.filter((p) => p.isMadeToOrder === true);
    }

    // 4. Client Side Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.listedPrice - b.listedPrice);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.listedPrice - a.listedPrice);
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(result);
  }, [products, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-walnut-brown leading-tight">
          Browse Our Creations
        </h1>
        <p className="text-sm sm:text-base text-charcoal-text/75 font-medium max-w-xl">
          Discover hand-finished baby cots, chests, cabinets, wardrobes, and TV
          stands. Standard builds are in stock; customizations are made to
          order.
        </p>
      </div>

      {/* Filter panel */}
      <ProductFilters />

      {/* Grid or Load states */}
      {loading ? (
        <Loader type="skeleton-grid" count={6} />
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-6">
          <div className="text-xs font-semibold text-charcoal-text/50 uppercase tracking-wider pl-1">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </div>
          <ProductGrid products={filteredProducts} />
        </div>
      ) : (
        <EmptyState
          title="No products match filters"
          description="Try clearing your search query, selecting 'All Categories', or choosing a different availability filter."
        />
      )}
    </div>
  );
}
