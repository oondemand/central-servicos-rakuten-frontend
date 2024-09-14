import React from "react";
import CaixaEntrada from "./CaixaEntrada";
import Etapa from "./Etapa";
import ContaPagar from "./ContaPagar";
import { useEtapa } from "../contexts/EtapaContext";

const Esteira = () => {
  const { listaEtapas } = useEtapa();

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 h-full">
      <div className="overflow-x-auto">
        <div className="flex space-x-4 max-w-screen-2xl mx-auto">
          <div className="flex-shrink-0">
            <CaixaEntrada />
          </div>
          {listaEtapas.map((etapa) => (
            <div key={etapa._id} className="flex-shrink-0">
              <Etapa etapa={etapa} />
            </div>
          ))}
          <div className="flex-shrink-0">
            <ContaPagar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Esteira;
