import React, { useState, useEffect } from 'react';
import api from '../../api/apiService';
import CrudModal from './CrudModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

const CrudUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [status, setStatus] = useState('ativo');
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuarioData = { nome, email, senha, status };

        try {
            if (editId) {
                await api.put(`/usuarios/${editId}`, usuarioData);
            } else {
                await api.post('/usuarios', usuarioData);
            }

            setNome('');
            setEmail('');
            setSenha('');
            setStatus('ativo');
            setEditId(null);
            setIsModalOpen(false);
            fetchUsuarios();
        } catch (error) {
            console.error('Erro ao salvar usuário:', error.message);
        }
    };

    const handleEdit = (usuario) => {
        setNome(usuario.nome);
        setEmail(usuario.email);
        setStatus(usuario.status);
        setEditId(usuario._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/usuarios/${id}`);
            fetchUsuarios();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error.message);
        }
    };

    const confirmDelete = (usuario) => {
        setItemToDelete(usuario);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>

            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Criar Novo Usuário
            </button>

            <ul className="space-y-4">
                {usuarios.map((usuario) => (
                    <li key={usuario._id} className="bg-white dark:bg-gray-900 p-4 rounded-lg flex justify-between">
                        <div>
                            <h3 className="font-bold">{usuario.nome}</h3>
                            <p>Email: {usuario.email}</p>
                            <p>Status: {usuario.status}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(usuario)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => confirmDelete(usuario)}
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
                title={editId ? 'Editar Usuário' : 'Criar Usuário'}
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
                        <label className="block text-gray-700 dark:text-gray-300">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 dark:text-gray-300">Senha:</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
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

export default CrudUsuarios;
