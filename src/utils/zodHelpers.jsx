import { z } from "zod";

/**
 * Função que transforma "" em undefined
 */
export const preprocessEmptyToUndefined = (schema) =>
  z.preprocess((val) => {
    return val === "" ? undefined : val;
  }, schema);
