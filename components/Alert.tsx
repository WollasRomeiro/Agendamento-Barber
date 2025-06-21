import React from 'react';

type AlertVariant = 'error' | 'warning' | 'info' | 'success';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

// Icons remain the same, their color will be controlled by styles
const Icons: Record<AlertVariant, React.FC<{ className?: string }>> = {
  error: ({ className }) => ( // ExclamationTriangle
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  warning: ({ className }) => ( // ExclamationTriangle (same as error, color differentiates)
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  ),
  info: ({ className }) => ( // InformationCircle
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
    </svg>
  ),
  success: ({ className }) => ( // CheckCircle
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
};

// Black, Orange, White/Neutral palette
const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: string; title: string }> = {
  error:   { bg: 'bg-orange-600/10', border: 'border-orange-600/50', text: 'text-orange-300', icon: 'text-orange-500', title: 'text-orange-400'},
  warning: { bg: 'bg-orange-500/10', border: 'border-orange-500/50', text: 'text-orange-400', icon: 'text-orange-500', title: 'text-orange-400' },
  info:    { bg: 'bg-neutral-800/50', border: 'border-neutral-700', text: 'text-neutral-300', icon: 'text-orange-500', title: 'text-neutral-200' },
  success: { bg: 'bg-neutral-800/50', border: 'border-neutral-700', text: 'text-neutral-300', icon: 'text-orange-500', title: 'text-neutral-200' },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  className = '',
  showIcon = true,
}) => {
  const styles = variantStyles[variant];
  const IconComponent = Icons[variant];

  return (
    <div
      className={`p-4 border rounded-md ${styles.bg} ${styles.border} ${className}`}
      role="alert"
      aria-live={variant === 'error' || variant === 'warning' ? 'assertive' : 'polite'}
    >
      <div className="flex">
        {showIcon && IconComponent && (
          <div className="flex-shrink-0 mr-3">
            <IconComponent className={`w-5 h-5 ${styles.icon}`} />
          </div>
        )}
        <div className="flex-grow">
          {title && <h3 className={`text-sm font-semibold mb-1 ${styles.title}`}>{title}</h3>}
          <div className={`text-sm ${styles.text}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};