// src/components/configuracoes/ConfigTabs.js
import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
} from "@chakra-ui/react";

import { UsuariosList } from "../usuariosList/index";
import { RegistrosTable } from "../registrosTable";
import { obterTodosRegistros } from "../../services/controleAlteracao";
import { format } from "date-fns";

const ConfigTabs = () => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await obterTodosRegistros();

        const refactoredData = response.data.map((e) => {
          return {
            ...e,
            dataHora: format(e.dataHora, "dd/MM/yyyy HH:mm"),
            usuario: e.usuario.nome,
          };
        });

        setData(refactoredData);
      } catch (err) {
        console.log(err);
        console.log("Error");
      }
    };

    fetchData();
  }, []);
  return (
    <Box bg="white" boxShadow="md" rounded="md" p={4}>
      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>Usuários</Tab>
          <Tab>Registros</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UsuariosList />
          </TabPanel>
          <TabPanel>
            {data?.length > 0 && <RegistrosTable data={data} />}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ConfigTabs;
