import React, {useRef} from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from '@chakra-ui/react';

import { Input } from '@chakra-ui/react';
import { saveAs } from 'file-saver';

import { useToast } from "@chakra-ui/react";

import {exportarServicos, exportarPrestadores, importarRPAs } from "../../services/acoesEtapaService"

const IntegracaoRPAs = () => {
  const toast = useToast();
  const inputFileRef = useRef(null);

const downloadPrestadores = async () => {
    try {
      const {data} = await exportarPrestadores()

      const blob = new Blob([data], { type: 'text/plain' });
      
      saveAs(blob, 'prestadores.txt');
    } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
    }
};

const downloadServicos = async () => {
  try {
      const {data} = await exportarServicos()

      const blob = new Blob([data], { type: 'text/plain' });
      
      saveAs(blob, 'servicos.txt');
  } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
  }
};

const handleImportRpas = async (e) => {
 const response = await importarRPAs(e.target.files[0])
 if(response.status === 201){
  toast({
    title: "Arquivo importado com sucesso!",
    status: "success",
    duration: 5000,
    isClosable: true,
    position: "top-right"
  });

  inputFileRef.current.value = null;
 }
 
}

  return (
    <Tabs variant="enclosed" mb={4}>
      <TabList>
        <Tab>Exportar Prestadores</Tab>
        <Tab>Exportar Serviços</Tab>
        <Tab>Importar RPAs</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <Button onClick={downloadPrestadores} colorScheme="brand">Gerar Arquivo</Button>
        </TabPanel>
        <TabPanel>
          <Button colorScheme="brand" onClick={downloadServicos} >Gerar Arquivo</Button>
        </TabPanel>
        <TabPanel>
          <div>
            <label>
              Selecione os PDFs dos <i>RPAs</i> gerados:
            </label>
            <div/>
            <Button onClick={() => inputFileRef.current.click()} colorScheme="brand">Importar</Button>
            <Input
              type="file"
              ref={inputFileRef}
              onChange={handleImportRpas}
              style={{ display: "none" }}
              accept=".pdf"
            />
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default IntegracaoRPAs;