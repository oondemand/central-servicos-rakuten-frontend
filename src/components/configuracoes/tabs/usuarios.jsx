import { TabPanel } from "@chakra-ui/react";
import { UsuariosList } from "../../usuariosList";

export const UsuariosTabs = () => {
  return (
    <TabPanel>
      <UsuariosList />
    </TabPanel>
  );
};
