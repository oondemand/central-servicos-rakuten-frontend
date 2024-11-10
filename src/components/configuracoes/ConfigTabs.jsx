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
import CrudUsuarios from "./CrudUsuarios";

const ConfigTabs = () => {
  return (
    <Box
      bg="white"
      boxShadow="md"
      rounded="md"
      p={4}
    >
      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>Usuários</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Heading as="h3" fontSize="xl" mb={4}>
              Configurações Gerais
            </Heading>

            <CrudUsuarios />

          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ConfigTabs;
