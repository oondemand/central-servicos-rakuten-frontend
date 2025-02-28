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
import { listarTicketsArquivados } from "../../services/ticketService";
import { TicketsArquivadoTable } from "../ticketsArquivadosTable";
import { useTicket } from "../../contexts/TicketContext";

const ConfigTabs = () => {
  const { alterarStatusTicket } = useTicket();
  const [data, setData] = React.useState({
    registros: [],
    ticketsArquivados: [],
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsArquivados = await listarTicketsArquivados();
        const { data: registros } = await obterTodosRegistros();

        const refactoredData = registros?.map((e) => {
          return {
            ...e,
            dataHora: format(e.dataHora, "dd/MM/yyyy HH:mm"),
            usuario: e.usuario?.nome || "Sistema",
          };
        });

        if (ticketsArquivados && refactoredData) {
          setData((prev) => ({
            ...prev,
            registros: refactoredData,
            ticketsArquivados,
          }));
        }
      } catch (err) {
        console.log(err);
        console.log("Error");
      }
    };

    fetchData();
  }, []);

  const onRestoreTicket = async ({ id }) => {
    await alterarStatusTicket(id, "revisao");

    const tickets = data.ticketsArquivados.filter((item) => item._id !== id);
    setData((prev) => ({ ...prev, ticketsArquivados: tickets }));
  };

  return (
    <Box bg="white" boxShadow="md" rounded="md" p={4}>
      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>Usuários</Tab>
          <Tab>Tickets arquivados</Tab>
          <Tab>Registros</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UsuariosList />
          </TabPanel>
          <TabPanel>
            {data.ticketsArquivados?.length > 0 && (
              <TicketsArquivadoTable
                data={data.ticketsArquivados}
                onRestoreTicket={onRestoreTicket}
              />
            )}
          </TabPanel>
          <TabPanel>
            {data.registros?.length > 0 && (
              <RegistrosTable data={data.registros} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ConfigTabs;
