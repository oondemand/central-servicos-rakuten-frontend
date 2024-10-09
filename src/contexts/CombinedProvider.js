// src/contexts/CombinedProvider.js
import React from 'react';
import { AuthProvider } from './AuthContext';
import { BaseOmieProvider } from './BaseOmieContext';
import { EtapaProvider } from './EtapaContext';
import { TicketProvider } from './TicketContext';
import { NotificacaoProvider } from './NotificacaoContext';

const CombinedProvider = ({ children }) => {
  return (
    <AuthProvider>
      <BaseOmieProvider>
        <EtapaProvider>
          <TicketProvider>
            <NotificacaoProvider>
              {children}
            </NotificacaoProvider>
          </TicketProvider>
        </EtapaProvider>
      </BaseOmieProvider>
    </AuthProvider>
  );
};

export default CombinedProvider;
