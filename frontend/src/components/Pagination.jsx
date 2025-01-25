import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white bg-opacity-50 p-4 rounded-xl border border-gray-300">
      <p className="text-sm text-black">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-black rounded-lg bg-gray-200 hover:bg-gray-300 text-black disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-black rounded-lg bg-gray-200 hover:bg-gray-300 text-black disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
