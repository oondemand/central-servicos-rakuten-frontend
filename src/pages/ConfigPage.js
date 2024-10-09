// src/pages/ConfigPage.js
import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ConfigTabs from "../components/configuracoes/ConfigTabs";

const ConfigPage = () => {
  return (
    <>
      <Header />
      <main className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-8">Configurações</h1>
        <ConfigTabs />
      </main>
      <Footer />
    </>
  );
};

export default ConfigPage;
