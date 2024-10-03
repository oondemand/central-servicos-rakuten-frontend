import React from "react";

import { BaseOmieProvider } from "../contexts/BaseOmieContext";
import { TicketProvider } from "../contexts/TicketContext";

import Header from "../components/common/Header";
import Esteira from "../components/Esteira";
import Footer from "../components/common/Footer";
import { EtapaProvider } from "../contexts/EtapaContext";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <BaseOmieProvider>
        <EtapaProvider>
          <TicketProvider>
              <Header />
              <main className="flex-grow p-4 flex">
                <Esteira />
              </main>
              <Footer />
          </TicketProvider>
        </EtapaProvider>
      </BaseOmieProvider>
    </div>
  );
};

export default HomePage;
