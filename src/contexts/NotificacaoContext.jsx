// src/contexts/NotificacaoContext.js
import React, { createContext, useState, useContext } from 'react';
import { useToast } from '@chakra-ui/react';

const NotificacaoContext = createContext();

export const NotificacaoProvider = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState([]);
  const toast = useToast();

  const adicionarNotificacao = (tipo, mensagem, detalhes = '') => {
    const novaNotificacao = {
      id: Date.now(),
      tipo,
      mensagem,
      detalhes,
      showDetalhes: false,
    };
    setNotificacoes(prev => [...prev, novaNotificacao]);

    toast({
      title: tipo === 'erro' ? 'Erro' : 'Informação',
      description: mensagem,
      status: tipo === 'erro' ? 'error' : 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  const removerNotificacao = (id) => {
    setNotificacoes(prev => prev.filter(notificacao => notificacao.id !== id));
  };

  const toggleDetalhes = (id) => {
    setNotificacoes(prev =>
      prev.map(notificacao =>
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
