// src/services/PrestadorService.js
import api from "./api";

export const importarComissoes = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file, file.name);

    api.post("acoes-etapas/importar-comissoes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const exportarServicos = async (servicos) => {
  try {
    const response = await api.post("acoes-etapas/exportar-servicos", servicos);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao exportar serviços:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const exportarPrestadores = async (prestadores) => {
  try {
    const response = await api.post("acoes-etapas/exportar-prestadores", prestadores);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao exportar prestadores:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const importarPrestadores = async (prestadores) => {
  try {
    const response = await api.post("acoes-etapas/importar-prestadores", prestadores);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao importar prestadores:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const importarRPAs = async (rpas) => {
  try {
    const response = await api.post("acoes-etapas/importar-rpas", rpas);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao importar RPAs:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};
