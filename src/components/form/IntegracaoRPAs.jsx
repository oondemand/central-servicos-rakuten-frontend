import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from '@chakra-ui/react';

const IntegracaoRPAs = () => {
  return (
    <Tabs variant="enclosed" mb={4}>
      <TabList>
        <Tab>Exportar Prestadores</Tab>
        <Tab>Exportar Serviços</Tab>
        <Tab>Importar RPAs</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <div>Total de Novos Prestadores: 100</div>
          <div>Total de Prestadores alterados: 0</div>
          <Button colorScheme="brand">Gerar Arquivo</Button>
        </TabPanel>
        <TabPanel>
          <div>Total de Tickets: 350</div>
          <div>Total de Prestadores: 320</div>
          <div>Total de Serviços: 1.740</div>
          <Button colorScheme="brand">Gerar Arquivo</Button>
        </TabPanel>
        <TabPanel>
          <div>
            <label>
              Selecione os PDFs dos <i>RPAs</i> gerados:
            </label>
            <div>
              <input type="file" />
            </div>
            <Button colorScheme="brand">Importar</Button>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default IntegracaoRPAs;