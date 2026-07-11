import React from 'react';

export default function Loader({
  type = 'spinner', // 'spinner' | 'skeleton-grid' | 'skeleton-detail'
  count = 6, // for grid skeleton
  className = '',
}) {
  if (type === 'skeleton-grid') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-walnut-brown/10 overflow-hidden shadow-xs animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-[4/3] bg-walnut-brown/5 w-full" />
            {/* Title / Price Info */}
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="h-4 bg-walnut-brown/10 rounded-full w-16" />
                <div className="h-4 bg-walnut-brown/10 rounded-full w-24" />
              </div>
              <div className="h-5 bg-walnut-brown/15 rounded-md w-3/4" />
              <div className="h-6 bg-walnut-brown/20 rounded-md w-1/3" />
              <div className="pt-2 flex gap-2">
                <div className="h-9 bg-walnut-brown/15 rounded-xl w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'skeleton-detail') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-pulse ${className}`}>
        {/* Gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-[4/3] w-full rounded-2xl bg-walnut-brown/5" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="aspect-square rounded-xl bg-walnut-brown/5" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-5 bg-walnut-brown/10 rounded-full w-24" />
            <div className="h-8 bg-walnut-brown/20 rounded-md w-2/3" />
            <div className="h-6 bg-walnut-brown/15 rounded-md w-1/3" />
          </div>
          <hr className="border-walnut-brown/10" />
          <div className="space-y-2">
            <div className="h-4 bg-walnut-brown/10 rounded-md w-full" />
            <div className="h-4 bg-walnut-brown/10 rounded-md w-full" />
            <div className="h-4 bg-walnut-brown/10 rounded-md w-5/6" />
          </div>
          <div className="space-y-3 pt-4">
            <div className="h-10 bg-walnut-brown/15 rounded-xl w-full" />
            <div className="h-10 bg-walnut-brown/10 rounded-xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Default Spinner
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="w-10 h-10 border-4 border-soft-sage/35 border-t-walnut-brown rounded-full animate-spin"></div>
      <p className="mt-3 text-xs font-semibold text-walnut-brown/70 tracking-wider uppercase">Loading content...</p>
    </div>
  );
}
