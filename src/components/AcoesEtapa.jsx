import React, { useRef } from "react";
import { Box, Button } from "@chakra-ui/react";
import * as XLSX from "xlsx";
import * as acoesEtapaService from "../services/acoesEtapaService";

const AcoesEtapa = ({ etapa, setIsAddModalOpen }) => {
  const inputFileRef = useRef(null);

  const handleCadastrarTicket = () => {
    setIsAddModalOpen(true);
  };

  const handleImportarComissoes = () => {
    inputFileRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Aqui você pode processar o arquivo Excel e pegar os dados necessários
        const sheetName = workbook.SheetNames[0]; // Pega o nome da primeira aba
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Dados importados:", jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleExportarServicos = async () => {
    try {
      const response = await acoesEtapaService.exportarServicos();
      console.log("Serviços exportados:", response);
    } catch (error) {
      console.error("Erro ao exportar serviços:", error);
    }
  };

  const handleExportarPrestadores = async () => {
    try {
      const response = await acoesEtapaService.exportarPrestadores();
      console.log("Prestadores exportados:", response);
    } catch (error) {
      console.error("Erro ao exportar prestadores:", error);
    }
  };

  const handleImportarPrestadores = async () => {
    try {
      const response = await acoesEtapaService.importarPrestadores();
      console.log("Prestadores importados:", response);
    } catch (error) {
      console.error("Erro ao importar prestadores:", error);
    }
  };

  const handleImportarRPAs = async () => {
    try {
      const response = await acoesEtapaService.importarRPAs();
      console.log("RPAs importados:", response);
    } catch (error) {
      console.error("Erro ao importar RPAs:", error);
    }
  };

  return (
    <>
      {etapa.codigo === "requisicao" && (
        <Box mt={4}>
          <Button onClick={handleCadastrarTicket} bg="#5DC3DC" color="white" width="100%" mb={1}>
            Novo Ticket
          </Button>
          <Button onClick={handleImportarComissoes} bg="#5DC3DC" color="white" width="100%" mb={1}>
            Importar Comissões
          </Button>
          <input
            type="file"
            ref={inputFileRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept=".xlsx, .xls"
          />
        </Box>
      )}
      {etapa.codigo === "integracao-unico" && (
        <Box mt={4}>
          <Button onClick={handleExportarServicos} bg="#5DC3DC" color="white" width="100%" mb={1}>
            Exportar Serviços
          </Button>
          <Button
            onClick={handleExportarPrestadores}
            bg="#5DC3DC"
            color="white"
            width="100%"
            mb={1}
          >
            Exportar Prestadores
          </Button>
          <Button
            onClick={handleImportarPrestadores}
            bg="#5DC3DC"
            color="white"
            width="100%"
            mb={1}
          >
            Importar Prestadores
          </Button>
          <Button onClick={handleImportarRPAs} bg="#5DC3DC" color="white" width="100%" mb={1}>
            Importar RPA
          </Button>
        </Box>
      )}
    </>
  );
};

export default AcoesEtapa;
