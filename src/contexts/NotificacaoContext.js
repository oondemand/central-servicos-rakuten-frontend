import React, { createContext, useState, useContext } from 'react';

const NotificacaoContext = createContext();

export const NotificacaoProvider = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState([]);

  const adicionarNotificacao = (tipo, mensagem, detalhes = '', autoClose = true) => {
    const novaNotificacao = { 
      id: Date.now(), 
      tipo, 
      mensagem, 
      detalhes, 
      showDetalhes: false, 
      autoClose 
    };
    setNotificacoes(prevNotificacoes => [...prevNotificacoes, novaNotificacao]);

    if (autoClose) {
      setTimeout(() => {
        removerNotificacao(novaNotificacao.id);
      }, 5000);
    }
  };

  const removerNotificacao = (id) => {
    setNotificacoes(prevNotificacoes => prevNotificacoes.filter(notificacao => notificacao.id !== id));
  };

  const toggleDetalhes = (id) => {
    setNotificacoes(prevNotificacoes =>
      prevNotificacoes.map(notificacao =>
        notificacao.id === id 
          ? { ...notificacao, showDetalhes: !notificacao.showDetalhes } 
          : notificacao
      )
    );
  };

  return (
    <NotificacaoContext.Provider value={{ notificacoes, adicionarNotificacao, removerNotificacao, toggleDetalhes }}>
      {children}
    </NotificacaoContext.Provider>
  );
};


export const useNotificacao = () => useContext(NotificacaoContext);
