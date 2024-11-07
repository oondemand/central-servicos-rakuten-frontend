import React, {useRef, useState} from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button, Box, Flex } from '@chakra-ui/react';

import { Input } from '@chakra-ui/react';

import { useToast } from "@chakra-ui/react";

import {importarComissoes } from "../../services/acoesEtapaService"


const ImportacaoComissoes = () => {
  const toast = useToast();
  const inputFileRef = useRef(null);

  const [competencia, setCompetencia] = useState({mes: "", ano: ""})

  const importCommissions = async(e) => {
    console.log(competencia);
    
    if(competencia.ano === '' || competencia.mes === ""){
      toast({
        title: "Campos não preenchidos",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      })
    }
    await importarComissoes({file: e.target.files[0], competencia: `${competencia.mes}${competencia.ano}`})
   
    toast({
      title: "O arquivo foi enviado e esta sendo processado!",
      status: "info",
      duration: 5000,
      isClosable: true,
      position: "top-right"
    });

    inputFileRef.current.value = null;
    setCompetencia({ano: "", mes: ""})
  }

  return (
    <div>
      <div>
        <label>
          Selecione a Planilha de <i>Payment Control</i>:
        </label>
        <Flex my={2} gap={4} >
          <Input value={competencia.mes} onChange={(e) => setCompetencia((prev) => ({...prev, mes: e.target.value, }))} w="20" placeholder='Mês' />
          <Input value={competencia.ano} onChange={(e) => setCompetencia((prev) => ({...prev, ano: e.target.value, }))} w="20" placeholder='Ano' />
        </Flex>
      </div>
        <Button disabled={competencia.ano === "" || competencia.mes === ""} onClick={() => inputFileRef.current.click()} colorScheme="brand">Importar comissões</Button>
        <Input
          type="file"
          ref={inputFileRef}
          onChange={importCommissions}
          style={{ display: "none" }}
          accept=".xlsx, .xls, .xlsm, .xltx, .xltm, .xlsb"
        />
    </div>
  );
};

export default ImportacaoComissoes;
