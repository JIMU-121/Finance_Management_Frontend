import { useState, useCallback } from "react";

export function usePagination(defaultPageSize = 10, defaultPageNumber = 1) {
  const [pageNumber, setPageNumber] = useState(defaultPageNumber);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [totalItems, setTotalItems] = useState(0);

  // Helper to update both page size and reset page number to 1
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPageNumber(1);
  }, []);

  return {
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    totalItems,
    setTotalItems,
    handlePageSizeChange,
    
    // Spreadable props for custom pagination components or DataTable
    paginationProps: {
      pageNumber,
      pageSize,
      totalItems,
      onPageChange: setPageNumber,
      onPageSizeChange: handlePageSizeChange,
    }
  };
}
