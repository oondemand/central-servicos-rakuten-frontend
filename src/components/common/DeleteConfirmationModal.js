import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 relative">
                <h2 className="text-2xl font-bold mb-4">Confirmação de Exclusão</h2>
                <p>Você tem certeza que deseja excluir o seguinte item?</p>
                <div className="mt-4">
                    <p><strong>Nome:</strong> {item.nome}</p>
                    {item.email && <p><strong>Email:</strong> {item.email}</p>}
                    {item.cnpj && <p><strong>CNPJ:</strong> {item.cnpj}</p>}
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
