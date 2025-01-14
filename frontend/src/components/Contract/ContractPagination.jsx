function ContractPagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  return (
    <div className="flex justify-between items-center mt-4">
      <div>
        Hiện {(currentPage - 1) * itemsPerPage + 1} đến {Math.min(currentPage * itemsPerPage, totalItems)} của {totalItems} dòng
      </div>
      <div className="flex gap-2">
        <button 
          className="px-3 py-1 border rounded hover:bg-gray-50"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
        <button 
          className="px-3 py-1 border rounded hover:bg-gray-50"
          onClick={() => onPageChange(2)}
        >
          2
        </button>
        <button 
          className="px-3 py-1 border rounded hover:bg-gray-50"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Tiếp
        </button>
      </div>
    </div>
  );
}

export default ContractPagination; 