// src/contexts/CombinedProvider.js
import React from "react";
import { BaseOmieProvider } from "./BaseOmieContext";
import { EtapaProvider } from "./EtapaContext";
import { TicketProvider } from "./TicketContext";

const CombinedProvider = ({ children }) => {
  return (
    <BaseOmieProvider>
      <EtapaProvider>
        <TicketProvider>{children}</TicketProvider>
      </EtapaProvider>
    </BaseOmieProvider>
  );
};

export default CombinedProvider;
