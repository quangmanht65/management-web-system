function ContractFilter({ itemsPerPage, onItemsPerPageChange, searchTerm, onSearchChange }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <span>Hiện</span>
        <select 
          className="border rounded px-2 py-1"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>dòng</span>
      </div>
      <div className="flex items-center gap-2">
        <span>Tìm kiếm:</span>
        <input
          type="text"
          className="border rounded px-3 py-1 w-64"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </div>
    </div>
  );
}

export default ContractFilter; 