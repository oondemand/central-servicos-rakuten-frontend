import React, {useRef, useState} from 'react';
import { Tabs, TabList,IconButton, TabPanels, Tab, TabPanel, Button, Flex, Box, HStack, Stack, VStack} from '@chakra-ui/react';

import { DeleteIcon  } from "@chakra-ui/icons";

import { Input } from '@chakra-ui/react';
import { saveAs } from 'file-saver';

import { useToast } from "@chakra-ui/react";

import {exportarServicos, exportarPrestadores, importarRPAs } from "../../services/acoesEtapaService"

const IntegracaoRPAs = () => {
  const toast = useToast();
  const inputFileRef = useRef(null);

  const [arquivos, setArquivos] = useState([]);

  const handleArquivoChange = (event) => {
    const arquivosSelecionados = Array.from(event.target.files);
    setArquivos((prev) => ([...prev, ...arquivosSelecionados])); 
  };


const downloadPrestadores = async () => {
    try {
      const response = await exportarPrestadores()
      
      if(response.status === 200){
        return toast({
          title: "Prestadores sendo exportados verifique seu email!",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
      }

      return toast({
        title: "Ouve um erro ao exportar prestadores!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        description: response.data.message ?? ""
      });
    } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
    }
};

const downloadServicos = async () => {
  try {
      const response = await exportarServicos()
      if(response.status === 200){
        return toast({
          title: "Serviços sendo exportados verifique seu email!",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
      }

      return toast({
        title: "Ouve um erro ao exportar serviços!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        description: response.data.message ?? ""
      });
  } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
  }
};

const handleImportRpas = async (e) => {
 const response = await importarRPAs(arquivos)
 if(response.status === 200){
  toast({
    title: "Arquivos enviado com sucesso, verifique seu email!",
    status: "info",
    duration: 5000,
    isClosable: true,
    position: "top-right"
  });

  setArquivos([])
  inputFileRef.current.value = null;
 }
 
}

const handleRemoveFile = (arquivo) => {
  const files = arquivos.filter(e => e.name !== arquivo.name)
  setArquivos(files)
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
        <TabPanel >
          <div>
            <label>
              Selecione os PDFs dos <i>RPAs</i> gerados:
            </label>
            <div/>

            <VStack align="self-start" gap={2} py={4} w="container.sm">
              {arquivos.map((arquivo, index) => (
                <Flex gap={8} key={index}>
                  <div> 
                    {arquivo.name} 
                  </div>

                  <IconButton
                      size="xs"
                      colorScheme="gray"
                      onClick={() => {handleRemoveFile(arquivo)}}
                    >
                      <DeleteIcon />
                    </IconButton>
                </Flex>
              ))}
            </VStack>
          <Flex gap={4}>
            <Button onClick={() => inputFileRef.current.click()} colorScheme="brand">Importar</Button>
            <Input
              type="file"
              ref={inputFileRef}
              onChange={handleArquivoChange}
              style={{ display: "none" }}
              accept=".pdf"
            />
          <Button onClick={handleImportRpas}>Enviar</Button>
          </Flex>

          
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default IntegracaoRPAs;