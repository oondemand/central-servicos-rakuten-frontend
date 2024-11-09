// src/services/PrestadorService.js
import api from "./api";

export const importarComissoes = async ({file,mes, ano}) => {
  try {
    const formData = new FormData();
    formData.append("file", file, file.name);

    api.post(`acoes-etapas/importar-comissoes?mes=${mes}&ano=${ano}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return true;
  } catch (error) {
    throw error;
  }
};

export const exportarServicos = async () => {
  try {
    const response = await api.post('acoes-etapas/exportar-servicos')

    return response; 
  } catch (error) {
    console.error("Erro ao exportar serviços:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const exportarPrestadores = async () => {
  try {
    const response = await api.post("acoes-etapas/exportar-prestadores")

    return response; 
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

export const importarRPAs = async (files) => {
  try {
    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }
    

    const response = await api.post("acoes-etapas/importar-rpas", formData, { headers: {
      "Content-Type": "multipart/form-data",
    }});


    return response
  } catch (error) {
    console.error("Erro ao importar RPAs:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};
