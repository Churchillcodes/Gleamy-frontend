import React, { useState } from 'react';
import { HiArrowLeft, HiArrowRight, HiX } from 'react-icons/hi';

export default function ProductGallery({ images = [], productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[4/3] rounded-2xl bg-walnut-brown/5 flex flex-col items-center justify-center text-walnut-brown/30">
        <svg className="w-16 h-16 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-semibold uppercase tracking-wider mt-2">No Images Available</span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Preview Container */}
      <div 
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-[4/3] rounded-2xl bg-walnut-brown/5 overflow-hidden border border-walnut-brown/10 cursor-zoom-in shadow-xs group"
      >
        <img
          src={activeImage.url}
          alt={`${productName} - Preview`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-walnut-brown p-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <HiArrowLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-walnut-brown p-2.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <HiArrowRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Navigation Row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 select-none">
          {images.map((img, idx) => (
            <button
              key={img.publicId || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 aspect-square rounded-xl overflow-hidden bg-walnut-brown/5 border-2 transition-all flex-shrink-0 cursor-pointer ${
                idx === activeIndex
                  ? 'border-walnut-brown ring-2 ring-walnut-brown/15 scale-95'
                  : 'border-transparent hover:border-walnut-brown/30'
              }`}
            >
              <img
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Overlay modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center p-4">
          {/* Top Actions bar */}
          <div className="w-full flex justify-between items-center max-w-7xl">
            <span className="text-white text-sm font-semibold tracking-wider">
              {activeIndex + 1} / {images.length} — {productName}
            </span>
            <button
              onClick={() => setLightboxOpen(false)}
              className="text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
              aria-label="Close lightbox"
            >
              <HiX size={24} />
            </button>
          </div>

          {/* Large display center row */}
          <div className="flex-grow flex items-center justify-between w-full max-w-7xl gap-4">
            {images.length > 1 ? (
              <button
                onClick={handlePrev}
                className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all active:scale-95 cursor-pointer"
                aria-label="Previous image"
              >
                <HiArrowLeft size={24} />
              </button>
            ) : <div className="w-12" />}

            <div className="max-h-[80vh] max-w-4xl flex items-center justify-center">
              <img
                src={activeImage.url}
                alt={`${productName} full view`}
                className="max-h-[80vh] max-w-full object-contain rounded-lg selection:bg-transparent"
              />
            </div>

            {images.length > 1 ? (
              <button
                onClick={handleNext}
                className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all active:scale-95 cursor-pointer"
                aria-label="Next image"
              >
                <HiArrowRight size={24} />
              </button>
            ) : <div className="w-12" />}
          </div>

          {/* Bottom helper */}
          <div className="text-white/40 text-xs pb-2 font-medium">
            Use arrows to browse. Click X or background to close.
          </div>
        </div>
      )}
    </div>
  );
}
