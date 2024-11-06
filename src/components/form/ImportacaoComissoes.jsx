import React, {useRef} from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from '@chakra-ui/react';

import { Input } from '@chakra-ui/react';

import { useToast } from "@chakra-ui/react";

import {importarComissoes } from "../../services/acoesEtapaService"


const ImportacaoComissoes = () => {
  const toast = useToast();
  const inputFileRef = useRef(null);

  const importCommissions = async(e) => {
    await importarComissoes(e.target.files[0])
   
    toast({
      title: "Arquivo importado com sucesso! Verifique seu email!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right"
    });

    inputFileRef.current.value = null;
  }

  return (
    <div>
      <div>
        <label>
          Selecione a Planilha de <i>Payment Control</i>:
        </label>

        <div />
      </div>
        <Button mt={2} onClick={() => inputFileRef.current.click()} colorScheme="brand">Importar comissões</Button>
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
