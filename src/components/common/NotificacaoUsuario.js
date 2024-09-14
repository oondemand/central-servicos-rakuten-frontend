import React from 'react';
import { useNotificacao } from '../../contexts/NotificacaoContext';

const NotificacaoUsuario = () => {
  const { notificacoes, removerNotificacao, toggleDetalhes } = useNotificacao();

  return (
    <div className="fixed top-0 right-0 m-4 space-y-2 z-50">
      {notificacoes.map((notificacao) => (
        <div key={notificacao.id} className={`p-4 rounded shadow-lg ${getStyleByTipo(notificacao.tipo)}`}>
          <div className="flex justify-between items-start">
            <div>
              <strong className="text-lg">{notificacao.mensagem}</strong>
              {Array.isArray(notificacao.detalhes) && notificacao.detalhes.length > 0 && (
                <button 
                  onClick={() => toggleDetalhes(notificacao.id)} 
                  className="ml-2 text-sm underline hover:text-gray-200 transition"
                >
                  {notificacao.showDetalhes ? 'Ocultar detalhes' : 'Mostrar detalhes'}
                </button>
              )}
            </div>
            <button 
              onClick={() => removerNotificacao(notificacao.id)} 
              className="ml-2 text-xl hover:text-gray-200 transition"
            >
              &times;
            </button>
          </div>
          {notificacao.showDetalhes && Array.isArray(notificacao.detalhes) && (
            <div className="mt-2 text-sm text-gray-100 dark:text-gray-400 bg-gray-700 p-2 rounded">
              <ul className="list-disc list-inside">
                {notificacao.detalhes.map((detalhe, index) => (
                  <li key={index}>
                    <strong>{detalhe.caminho}:</strong> {detalhe.mensagem}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  function getStyleByTipo(tipo) {
    switch (tipo) {
      case 'erro':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  }
};

export default NotificacaoUsuario;
