import React from 'react';
import { HiOutlineFolderOpen } from 'react-icons/hi';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'There are no records matching your request at this time.',
  icon: Icon = HiOutlineFolderOpen,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-walnut-brown/20 rounded-2xl bg-walnut-brown/2/20 max-w-md mx-auto ${className}`}>
      <div className="bg-walnut-brown/5 text-walnut-brown/60 p-4 rounded-full mb-4">
        <Icon size={36} />
      </div>
      <h4 className="font-heading text-lg font-bold text-walnut-brown mb-1.5">
        {title}
      </h4>
      <p className="text-charcoal-text/70 text-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="outline" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
