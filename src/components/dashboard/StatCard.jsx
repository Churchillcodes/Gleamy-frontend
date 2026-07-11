import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default', // 'default' | 'walnut' | 'sage'
  className = '',
}) {
  const bgStyles = {
    default: 'bg-white border border-walnut-brown/10 shadow-xs',
    walnut: 'bg-walnut-brown text-warm-cream border border-walnut-brown shadow-md',
    sage: 'bg-soft-sage text-walnut-brown border border-soft-sage shadow-md',
  };

  const titleColor = {
    default: 'text-charcoal-text/50',
    walnut: 'text-warm-cream/70',
    sage: 'text-walnut-brown/70',
  };

  const valueColor = {
    default: 'text-walnut-brown',
    walnut: 'text-white',
    sage: 'text-walnut-brown',
  };

  const iconBg = {
    default: 'bg-walnut-brown/5 text-walnut-brown',
    walnut: 'bg-white/10 text-white',
    sage: 'bg-walnut-brown/10 text-walnut-brown',
  };

  return (
    <div className={`p-6 rounded-2xl flex items-center justify-between gap-4 transition-all duration-300 ${bgStyles[variant]} ${className}`}>
      <div className="space-y-1.5">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${titleColor[variant]}`}>
          {title}
        </span>
        <div className={`text-2xl font-extrabold tracking-tight ${valueColor[variant]}`}>
          {value}
        </div>
        {description && (
          <p className={`text-xs ${variant === 'default' ? 'text-charcoal-text/60' : 'opacity-75'} font-medium`}>
            {description}
          </p>
        )}
      </div>

      {Icon && (
        <div className={`p-4 rounded-xl flex items-center justify-center ${iconBg[variant]}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}
