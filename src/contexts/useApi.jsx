import { useEffect, useState } from "react";

export const useApi = ({ queryFn }) => {
  const [queryState, setQueryState] = useState({
    isLoading: false,
    error: false,
    response: null,
  });

  const query = async () => {
    setQueryState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await queryFn();
      setQueryState((prev) => ({ isLoading: false, response, error: null }));
    } catch (error) {
      return setQueryState((prev) => ({
        isLoading: false,
        error,
        response: null,
      }));
    }
  };

  useEffect(() => {
    query();
  }, []);

  return {
    isLoading: queryState.isLoading,
    response: queryState.response,
    error: queryState.error,
  };
};
