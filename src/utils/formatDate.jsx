// src/utils/formatDate.js
import { format } from 'date-fns';

export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  return format(new Date(date), pattern);
};
