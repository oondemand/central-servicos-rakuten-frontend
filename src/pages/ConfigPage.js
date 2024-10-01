import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ConfigTabs from "../components/configuracoes/ConfigTabs";
import { BaseOmieProvider } from "../contexts/BaseOmieContext";

const ConfigPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <BaseOmieProvider>
        <Header />
        <main className="flex-grow p-4">
          <h1 className="text-3xl font-bold mb-8">Configurações</h1>
          <ConfigTabs />
        </main>
        <Footer />
      </BaseOmieProvider>
    </div>
  );
};

export default ConfigPage;
