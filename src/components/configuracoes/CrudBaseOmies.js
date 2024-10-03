import React, { useState, useEffect } from 'react';
import api from '../../api/apiService';
import CrudModal from './CrudModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const CrudBaseOmies = () => {
    const [baseomies, setBaseOmies] = useState([]);
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [appKey, setAppKey] = useState('');
    const [appSecret, setAppSecret] = useState('');
    const [status, setStatus] = useState('ativo');
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchBaseOmies();
    }, []);

    const fetchBaseOmies = async () => {
        try {
            const response = await api.get('/baseomies');
            setBaseOmies(response.data);
        } catch (error) {
            console.error('Erro ao buscar baseomies:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const baseData = { nome, cnpj, appKey, appSecret, status };

        try {
            if (editId) {
                await api.put(`/baseomies/${editId}`, baseData);
            } else {
                await api.post('/baseomies', baseData);
            }

            setNome('');
            setCnpj('');
            setAppKey('');
            setAppSecret('');
            setStatus('ativo');
            setEditId(null);
            setIsModalOpen(false);
            fetchBaseOmies();
        } catch (error) {
            console.error('Erro ao salvar base:', error.message);
        }
    };

    const handleEdit = (base) => {
        setNome(base.nome);
        setCnpj(base.cnpj);
        setAppKey(base.appKey);
        setAppSecret(base.appSecret);
        setStatus(base.status);
        setEditId(base._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/baseomies/${id}`);
            fetchBaseOmies();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Erro ao excluir base:', error.message);
        }
    };

    const confirmDelete = (base) => {
        setItemToDelete(base);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Bases Omie</h2>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Criar Nova Base Omie
            </button>

            <ul className="space-y-4">
                {baseomies.map((base) => (
                    <li key={base._id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex justify-between">
                        <div>
                            <h3 className="font-bold">{base.nome}</h3>
                            <p>CNPJ: {base.cnpj}</p>
                            <p>Status: {base.status}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(base)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => confirmDelete(base)}
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
                title={editId ? 'Editar Base Omie' : 'Criar Base Omie'}
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
                            value={appKey}
                            onChange={(e) => setAppKey(e.target.value)}
                            className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 dark:text-gray-300">App Secret Omie:</label>
                        <input
                            type="text"
                            value={appSecret}
                            onChange={(e) => setAppSecret(e.target.value)}
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

export default CrudBaseOmies;