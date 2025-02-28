import { useCallback, useEffect, useState } from "react";

export const useColumnVisibility = ({ key }) => {
  const user = JSON.parse(localStorage.getItem("usuario"))._id || "default";

  const STORAGE_KEY = `${user}@${key}_TANSTACK_REACT_TABLE_COLUMN_VISIBILITY`;

  const getColumnVisibilityFromStorage = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  };

  const [columnVisibility, setColumnVisibility] = useState({
    ...getColumnVisibilityFromStorage(),
  });

  const resetColumnVisibility = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setColumnVisibility({});
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  return { columnVisibility, setColumnVisibility, resetColumnVisibility };
};
