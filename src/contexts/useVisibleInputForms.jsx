import { useEffect, useState } from "react";

export const useVisibleInputForm = ({ key }) => {
  const user = JSON.parse(localStorage.getItem("usuario"))._id || "default";
  const STORAGE_KEY = `${user}@${key}_FORM_VISIBLE_INPUTS`;

  const getStatusFromStorage = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  };

  const [inputsVisibility, setInputsVisibility] = useState({
    ...getStatusFromStorage(),
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputsVisibility));
  }, [inputsVisibility]);

  return { inputsVisibility, setInputsVisibility };
};
