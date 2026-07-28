import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[1.4rem] font-semibold text-[#151717] flex items-center justify-between">
          <span>{label}</span>
          {props.required && <span className="text-red-500 font-normal">*</span>}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-5 text-neutral-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-[#F4F4F4] text-[#151717] rounded-[100px] text-[1.5rem] font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#151717] focus:bg-white transition-all duration-200 ${
            leftIcon ? 'pl-14' : 'pl-6'
          } ${rightIcon ? 'pr-14' : 'pr-6'} py-3.5 ${
            error ? 'border border-red-500 focus:ring-red-500' : 'border border-transparent'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-5 text-neutral-400 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <span className="text-red-600 text-[1.3rem] font-medium pl-3 animate-in fade-in">{error}</span>
      ) : helperText ? (
        <span className="text-neutral-500 text-[1.3rem] pl-3">{helperText}</span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
