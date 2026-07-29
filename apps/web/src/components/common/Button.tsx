import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'emerald';
  href?: string;
  onClick?: () => void;
  showArrow?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  href,
  onClick,
  showArrow = true,
  className = '',
  type = 'button',
}) => {
  const variantClass =
    variant === 'emerald'
      ? 'resida-button-emerald'
      : variant === 'secondary'
      ? 'resida-button-secondary'
      : 'resida-button-primary';

  const textString = typeof children === 'string' ? children : String(children);

  const content = (
    <span className="resida-button-content">
      <span className="resida-button-text">
        <span data-text={textString}>{children}</span>
      </span>

      {showArrow && (
        <span className="inline-flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m20.78 12.531-6.75 6.75a.75.75 0 1 1-1.06-1.061l5.47-5.47H3.75a.75.75 0 1 1 0-1.5h14.69l-5.47-5.469a.75.75 0 1 1 1.06-1.061l6.75 6.75a.75.75 0 0 1 0 1.061"
            />
          </svg>
        </span>
      )}
    </span>
  );

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//');
    if (isExternal) {
      return (
        <a href={href} className={`resida-button-round ${variantClass} ${className}`}>
          {content}
        </a>
      );
    }
    
    return (
      <Link to={href} className={`resida-button-round ${variantClass} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`resida-button-round ${variantClass} ${className}`}
    >
      {content}
    </button>
  );
};
