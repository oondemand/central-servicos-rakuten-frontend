import api from "./api";

// Serviço para adicionar um novo ticket
export const adicionarTicket = async (ticket) => {
  try {
    const response = await api.post("tickets", ticket);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao salvar ticket:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para alterar um ticket (usando PATCH)
export const alterarTicket = async (id, camposParaAtualizar) => {
  try {
    const response = await api.patch(`tickets/${id}`, camposParaAtualizar);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao alterar ticket:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para carregar um ticket pelo ID
export const carregarTicket = async (id) => {
  try {
    const response = await api.get(`tickets/${id}`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao carregar ticket:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para listar todos os tickets com ou sem filtro
export const listarTickets = async (filtro) => {
  try {
    const response = await api.get("tickets", { params: filtro });

    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao listar tickets:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

export const listarTicketsArquivados = async () => {
  try {
    const response = await api.get("tickets/arquivados");
    console.log(response);

    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao listar tickets:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para aprovar um ticket
export const aprovarTicket = async (id) => {
  try {
    const response = await api.post(`/aprovacoes/${id}/aprovar`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao aprovar ticket:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para reprovar um ticket
export const reprovarTicket = async (id) => {
  try {
    const response = await api.post(`/aprovacoes/${id}/recusar`);
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error("Erro ao reprovar ticket:", error);
    throw error; // Repassa o erro para que o chamador possa tratá-lo
  }
};

// Serviço para salvar um ticket (adicionar ou alterar)
export const salvarTicket = async (ticket) => {
  try {
    if (ticket._id) {
      return alterarTicket(ticket._id, ticket);
    } else {
      return adicionarTicket(ticket);
    }
  } catch (error) {
    console.error("Erro ao salvar ticket:", error);
    throw error;
  }
};

export const uploadFiles = async (ticketId, files) => {
  const formData = new FormData();
  files.forEach((e, i) => {
    formData.append("arquivos", files[i]);
  });

  try {
    return await api.post(`/tickets/${ticketId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Erro ao fazer upload de arquivos", error);
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    return await api.delete(`/tickets/arquivo/${fileId}`);
  } catch (error) {
    console.error("Erro ao deletar arquivo", error);
    throw error;
  }
};

export const listarArquivosDoTicket = async (filtro) => {
  try {
    const response = await api.get(`/tickets/${filtro}/arquivos`);
    return response.data;
  } catch (error) {
    console.error("Erro", error);
    throw error;
  }
};

//
// export const downloadFileFromTicket = async (path) => {
//   try {
//     const response = await api.get(path, {
//       responseType: 'blob'
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Erro ao baixar imagem", error);
//     throw error; // Repassa o erro para que o chamador possa tratá-lo
//   }
// };
