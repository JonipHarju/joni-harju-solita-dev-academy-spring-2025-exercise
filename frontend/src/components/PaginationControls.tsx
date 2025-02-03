import React from "react";
import { PaginationControlsProps } from "../../interfaces";

// pagination buttons to handle navigation between table pages.
// page  - current page number
// setPage - function to set the current page number
// totalPages - disable the next button when the current page is the last page.
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
