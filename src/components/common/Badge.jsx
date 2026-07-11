import React from 'react';

export default function Badge({
  children,
  variant = 'walnut',
  size = 'md',
  className = '',
}) {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full tracking-wide';
  
  const variants = {
    walnut: 'bg-walnut-brown/10 text-walnut-brown border border-walnut-brown/20',
    sage: 'bg-soft-sage/20 text-walnut-brown border border-soft-sage/40',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/50',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/50',
    danger: 'bg-red-50 text-red-800 border border-red-200/50',
    info: 'bg-blue-50 text-blue-800 border border-blue-200/50',
    whatsapp: 'bg-whatsapp-green/10 text-whatsapp-green border border-whatsapp-green/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
