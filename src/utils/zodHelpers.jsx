import { z } from "zod";

/**
 * Função que transforma "" em undefined
 */
export const preprocessEmptyToUndefined = (schema) =>
  z.preprocess((val) => {
    console.log("Val", val);
    return val === "" ? undefined : val;
  }, schema);
