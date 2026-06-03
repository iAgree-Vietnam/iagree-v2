import { useEffect } from 'react';

export function useFilterStorage(
  filterState: any,
  setFilterState: React.Dispatch<React.SetStateAction<any>>,
  storageKey: string
) {
  // Persist filter state into localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(filterState));
    }
  }, [filterState, storageKey]);

  // Load filter state from localStorage when component mounts
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedFilterState = localStorage.getItem(storageKey);
    if (storedFilterState) {
      setFilterState(JSON.parse(storedFilterState));
    }
  }, [setFilterState, storageKey]);
}