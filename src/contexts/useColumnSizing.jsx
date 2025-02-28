import { useCallback, useEffect, useState } from "react";

export const useColumnSizing = ({ key }) => {
  const user = JSON.parse(localStorage.getItem("usuario"))._id || "default";

  const STORAGE_KEY_COLUMN_SIZE = `${user}@${key}_TANSTACK_REACT_TABLE_COLUMN_SIZING`;
  const STORAGE_KEY_COLUMN_SIZE_INFO = `${user}@${key}_TANSTACK_REACT_TABLE_COLUMN_SIZING_INFO`;

  const getColumnSizing = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_COLUMN_SIZE)) || null;
  };

  const [columnSizing, setColumnSizing] = useState({
    ...getColumnSizing(),
  });

  const getColumnSizingInfo = () => {
    return (
      JSON.parse(localStorage.getItem(STORAGE_KEY_COLUMN_SIZE_INFO)) || null
    );
  };

  const [columnSizingInfo, setColumnSizingInfo] = useState({
    ...getColumnSizingInfo(),
  });

  const resetColumnSizing = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_COLUMN_SIZE_INFO);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLUMN_SIZE, JSON.stringify(columnSizing));
    localStorage.setItem(
      STORAGE_KEY_COLUMN_SIZE_INFO,
      JSON.stringify(columnSizingInfo)
    );
  }, [columnSizing, columnSizingInfo]);

  return {
    columnSizing,
    columnSizingInfo,
    setColumnSizing,
    setColumnSizingInfo,
    resetColumnSizing,
  };
};
