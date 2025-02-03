// components/PaginationControls.tsx
import React from "react";

interface PaginationControlsProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  setPage,
  totalPages,
}) => {
  return (
    <div className="flex justify-between mt-4 min-h-[40px] items-center">
      <button
        className="px-3 py-1 border border-gray-700 disabled:opacity-50"
        onClick={() => setPage(Math.max(page - 1, 1))}
        disabled={page === 1}
        type="button"
      >
        Previous
      </button>
      <button
        className="px-3 py-1 border border-gray-700 disabled:opacity-50"
        onClick={() => setPage(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        type="button"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
