import React, { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  footerActions,
}) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn" 
      />

      {/* Modal Card */}
      <div className={`relative bg-warm-cream w-full rounded-2xl shadow-2xl border border-walnut-brown/15 overflow-hidden transform transition-all duration-300 animate-scaleUp z-10 ${sizeClasses[size]}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-walnut-brown/10 bg-walnut-brown/5">
          <h3 className="font-heading text-lg font-bold text-walnut-brown">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-walnut-brown/65 hover:text-walnut-brown hover:bg-walnut-brown/10 p-1.5 rounded-full transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footerActions && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-walnut-brown/10 bg-walnut-brown/5">
            {footerActions}
          </div>
        )}

      </div>
    </div>
  );
}
