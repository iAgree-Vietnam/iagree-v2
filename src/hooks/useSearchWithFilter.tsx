import { useState, useEffect, useCallback } from "react";

// Dùng chung cho Jobs và Partners
export function useSearchWithFilters<T>(
  storageKey: string,
  initialFilters: T,
  perPage: number,
  updateQueryParams: (
    filters: T,
    page: number,
    searchTerm: string | null
  ) => void,
  setData: (data: any[]) => void,
  fetchData: (filters: T, page: number) => Promise<any>
) {
  const [searchFilters, setSearchFilters] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedFilters = localStorage.getItem(storageKey);
      return storedFilters ? JSON.parse(storedFilters) : initialFilters;
    }
    return initialFilters;
  });

  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const [page, setPage] = useState<number>(1);
  const [tempData, setTempData] = useState<any[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onLoadMore = async () => {
    if (isLoading) return;

    setPage((prevPage) => prevPage + 1);
  };

  const fetchAndUpdateData = async () => {
    setIsLoading(true);
    const response = await fetchData(searchFilters, page);
    setTempData(response.items);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAndUpdateData();
  }, [searchFilters, page]);

  // Lưu trạng thái bộ lọc và trang vào localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(searchFilters));
      localStorage.setItem("search_term", searchTerm || "");
      localStorage.setItem("page", String(page));
    }
  }, [searchFilters, page, searchTerm]);

  // Cập nhật queryParams trong URL
  useEffect(() => {
    updateQueryParams(searchFilters, page, searchTerm);
  }, [searchFilters, page, searchTerm]);

  // Thực hiện tìm kiếm
  const goSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset lại trang khi thay đổi tìm kiếm
  };

  // Tính toán số lượng bộ lọc đã chọn
  const totalSelectedFilters = Object.values(searchFilters as any).reduce(
    (acc: number, value) =>
      acc + (Array.isArray(value) ? value.length : value ? 1 : 0),
    0
  );

  return {
    searchFilters,
    setSearchFilters,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    tempData,
    setTempData,
    isCollapsed,
    setIsCollapsed,
    onLoadMore,
    goSearch,
    totalSelectedFilters,
    isLoading,
  };
}
