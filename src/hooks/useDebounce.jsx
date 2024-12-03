import { debounce } from "lodash";
import { useCallback } from "react";

export const useDebounce = (callback, delay = 500) => {
  const debouncedFunction = useCallback(debounce(callback, delay), []);

  return debouncedFunction;
};
