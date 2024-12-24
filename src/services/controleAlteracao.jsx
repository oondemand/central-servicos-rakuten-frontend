import api from "./api";

export const obterTodosRegistros = async () => {
  return await api.get("/registros");
};
