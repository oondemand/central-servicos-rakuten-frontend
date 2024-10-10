// src/pages/ConfigPage.js
import React from "react";
import ConfigTabs from "../components/configuracoes/ConfigTabs";

const ConfigPage = () => {
  return (
    <>
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-8">Configurações</h1>
        <ConfigTabs />
      </main>
    </>
  );
};

export default ConfigPage;
