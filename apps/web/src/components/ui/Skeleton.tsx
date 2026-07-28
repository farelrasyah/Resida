import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = '100%',
  height = '1.5rem',
}) => {
  return (
    <div
      style={{ width, height }}
      className={`bg-neutral-200 animate-pulse rounded-full ${className}`}
    />
  );
};
