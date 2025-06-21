import React from 'react';
import { Button } from './Button'; 

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  onEdit?: () => void; 
  isEditable?: boolean; 
  accentBorder?: boolean; 
  fullBorder?: boolean; // New prop for a full orange border
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  titleClassName = 'text-xl md:text-2xl font-semibold text-orange-500', // Default title class
  onEdit, 
  isEditable = true, 
  accentBorder = false,
  fullBorder = false 
}) => {
  const baseBg = 'bg-neutral-900'; // Very dark gray, almost black
  let borderClasses = '';
  let paddingClasses = 'p-6 md:p-8';

  if (accentBorder) {
    borderClasses = 'border-l-4 border-orange-500';
    paddingClasses = 'pl-5 pr-6 py-6 md:pl-7 md:pr-8 md:py-8'; // Adjust padding for left border
  } else if (fullBorder) {
    borderClasses = 'border border-orange-500';
  } else {
    borderClasses = 'border border-neutral-800'; // Subtle border for non-accented cards
  }


  return (
    <div className={`${baseBg} shadow-xl rounded-xl ${borderClasses} ${paddingClasses} ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className={titleClassName}>{title}</h2>
          {onEdit && isEditable && (
            <Button onClick={onEdit} variant="secondary" size="sm">
              Alterar
            </Button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};