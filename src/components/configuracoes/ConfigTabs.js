// src/components/configuracoes/ConfigTabs.js
import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import CrudUsuarios from './CrudUsuarios';
import CrudBaseOmies from './CrudBaseOmies';

const ConfigTabs = () => {
  return (
    <Tabs variant="enclosed" colorScheme="blue">
      <TabList mb="1em">
        <Tab>Usuários</Tab>
        <Tab>Bases Omie</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <CrudUsuarios />
        </TabPanel>
        <TabPanel>
          <CrudBaseOmies />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default ConfigTabs;
