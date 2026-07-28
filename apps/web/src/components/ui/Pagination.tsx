import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../../types/api.types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { current_page, last_page, total, per_page } = meta;

  if (last_page <= 1) return null;

  const startItem = (current_page - 1) * per_page + 1;
  const endItem = Math.min(current_page * per_page, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
      <div className="text-[1.3rem] text-neutral-500 font-medium">
        Menampilkan <span className="font-bold text-[#151717]">{startItem}</span> -{' '}
        <span className="font-bold text-[#151717]">{endItem}</span> dari{' '}
        <span className="font-bold text-[#151717]">{total}</span> data
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-[1.4rem] font-bold text-[#151717] px-3 py-1 bg-white rounded-full border border-neutral-200 shadow-sm">
          {current_page} / {last_page}
        </span>

        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
