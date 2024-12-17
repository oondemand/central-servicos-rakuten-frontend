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

const ConfigTabs = () => {
  return (
    <Box bg="white" boxShadow="md" rounded="md" p={4}>
      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>Usuários</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UsuariosList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ConfigTabs;
