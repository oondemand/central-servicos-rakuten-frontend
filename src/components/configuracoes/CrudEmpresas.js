import React, { useState, useEffect } from 'react';
import api from '../../api/apiService';
import CrudModal from './CrudModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const CrudEmpresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [appKeyOmie, setAppKeyOmie] = useState('');
    const [appSecretOmie, setAppSecretOmie] = useState('');
    const [status, setStatus] = useState('ativo');
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = async () => {
        try {
            const response = await api.get('/empresas');
            setEmpresas(response.data);
        } catch (error) {
            console.error('Erro ao buscar empresas:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const empresaData = { nome, cnpj, appKeyOmie, appSecretOmie, status };

        try {
            if (editId) {
                await api.put(`/empresas/${editId}`, empresaData);
            } else {
                await api.post('/empresas', empresaData);
            }

            setNome('');
            setCnpj('');
            setAppKeyOmie('');
            setAppSecretOmie('');
            setStatus('ativo');
            setEditId(null);
            setIsModalOpen(false);
            fetchEmpresas();
        } catch (error) {
            console.error('Erro ao salvar empresa:', error.message);
        }
    };

    const handleEdit = (empresa) => {
        setNome(empresa.nome);
        setCnpj(empresa.cnpj);
        setAppKeyOmie(empresa.appKeyOmie);
        setAppSecretOmie(empresa.appSecretOmie);
        setStatus(empresa.status);
        setEditId(empresa._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/empresas/${id}`);
            fetchEmpresas();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Erro ao excluir empresa:', error.message);
        }
    };

    const confirmDelete = (empresa) => {
        setItemToDelete(empresa);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Empresas</h2>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Criar Nova Empresa
            </button>

            <ul className="space-y-4">
                {empresas.map((empresa) => (
                    <li key={empresa._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                        <div>
                            <h3 className="font-bold">{empresa.nome}</h3>
                            <p>CNPJ: {empresa.cnpj}</p>
                            <p>Status: {empresa.status}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(empresa)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => confirmDelete(empresa)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <CrudModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editId ? 'Editar Empresa' : 'Criar Empresa'}
            >
                <form id="modal-form" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="block text-gray-700 dark:text-gray-300">Nome:</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 dark:text-gray-300">CNPJ:</label>
                        <input
                            type="text"
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 dark:text-gray-300">App Key Omie:</label>
                        <input
                            type="text"
                            value={appKeyOmie}
                            onChange={(e) => setAppKeyOmie(e.target.value)}
                            className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 dark:text-gray-300">App Secret Omie:</label>
                        <input
                            type="text"
                            value={appSecretOmie}
                            onChange={(e) => setAppSecretOmie(e.target.value)}
                            className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 dark:text-gray-300">Status:</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                        >
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                </form>
            </CrudModal>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDelete(itemToDelete._id)}
                item={itemToDelete}
            />
        </div>
    );
};

export default CrudEmpresas;
