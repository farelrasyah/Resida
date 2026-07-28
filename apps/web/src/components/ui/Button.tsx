import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[100px] transition-all duration-300 ease-out cursor-pointer disabled:opacity-60 disabled:pointer-events-none select-none';

  const variantStyles = {
    primary: 'bg-[#151717] text-white hover:bg-neutral-800 hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-[#F4F4F4] text-[#151717] hover:bg-neutral-200 active:scale-[0.98]',
    outline: 'border border-neutral-300 text-[#151717] bg-white hover:bg-neutral-50 hover:border-neutral-400 active:scale-[0.98]',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-[0.98]',
    ghost: 'text-[#151717] hover:bg-neutral-100 active:scale-[0.98]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-[1.4rem] gap-2 h-10',
    md: 'px-6 py-3 text-[1.5rem] gap-2.5 h-12',
    lg: 'px-8 py-4 text-[1.6rem] gap-3 h-14',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
