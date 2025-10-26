const Pagination = ({
  currentPage,
  totalPages,
  activeFilterCount,
  onPageChange,
}) => {
  if (activeFilterCount > 0 || totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    onPageChange(currentPage === 1 ? totalPages : currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage === totalPages ? 1 : currentPage + 1);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={handlePrevious}
        className={`px-4 py-2 text-white rounded-lg transition-colors ${
          currentPage === 1
            ? "bg-gray-300 hover:bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        Previous
      </button>

      <span className="px-4 py-2 text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        className={`px-4 py-2 text-white rounded-lg transition-colors ${
          currentPage === totalPages
            ? "bg-gray-300 hover:bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
