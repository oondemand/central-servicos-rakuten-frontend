// src/contexts/CombinedProvider.js
import React from "react";
import { BaseOmieProvider } from "./BaseOmieContext";
import { EtapaProvider } from "./EtapaContext";
import { TicketProvider } from "./TicketContext";
import { NotificacaoProvider } from "./NotificacaoContext";

const CombinedProvider = ({ children }) => {
  return (
    <BaseOmieProvider>
      <EtapaProvider>
        <TicketProvider>
          <NotificacaoProvider>{children}</NotificacaoProvider>
        </TicketProvider>
      </EtapaProvider>
    </BaseOmieProvider>
  );
};

export default CombinedProvider;
