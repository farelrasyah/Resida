import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 ${className}`}>
      {children}
    </div>
  );
};
