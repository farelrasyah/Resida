import React, { forwardRef } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  placeholder = 'Pilih opsi...',
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={selectId} className="text-[1.4rem] font-semibold text-[#151717]">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-[#F4F4F4] text-[#151717] rounded-[100px] text-[1.5rem] font-medium px-6 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#151717] focus:bg-white transition-all duration-200 cursor-pointer ${
            error ? 'border border-red-500 focus:ring-red-500' : 'border border-transparent'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && <span className="text-red-600 text-[1.3rem] font-medium pl-3">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
