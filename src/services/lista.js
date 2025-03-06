import api from "./api";

const obterListaPorCodigo = async ({ cod }) => {
  const { data } = await api.get(`listas/${cod}`);
  return data;
};

export const ListaService = {
  obterListaPorCodigo,
};
