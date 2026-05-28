import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;


  // Generate page numbers to display
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 px-6 py-4 bg-white border-t border-[#DCE5EF] font-poppins">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-[#DCE5EF] hover:border-btn-primary hover:text-btn-primary rounded-xl text-text-secondary disabled:opacity-40 disabled:hover:border-[#DCE5EF] disabled:hover:text-text-secondary transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-md-custom font-medium transition-all ${isActive
                ? 'bg-btn-primary text-white font-semibold'
                : 'bg-white border border-[#DCE5EF] text-text-secondary hover:border-btn-primary hover:text-btn-primary'
                }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-[#DCE5EF] hover:border-btn-primary hover:text-btn-primary rounded-xl text-text-secondary disabled:opacity-40 disabled:hover:border-[#DCE5EF] disabled:hover:text-text-secondary transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
