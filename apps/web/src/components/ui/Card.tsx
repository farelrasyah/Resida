import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', id, onClick }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100 transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
