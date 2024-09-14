import React, { useState } from 'react';
import CrudUsuarios from './CrudUsuarios';
import CrudEmpresas from './CrudEmpresas';

const ConfigTabs = () => {
    const [activeTab, setActiveTab] = useState('usuarios');

    const renderContent = () => {
        switch (activeTab) {
            case 'usuarios':
                return <CrudUsuarios />;
            case 'empresas':
                return <CrudEmpresas />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="flex mb-4">
                <button
                    onClick={() => setActiveTab('usuarios')}
                    className={`px-4 py-2 mr-2 rounded ${
                        activeTab === 'usuarios' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    Usuários
                </button>
                <button
                    onClick={() => setActiveTab('empresas')}
                    className={`px-4 py-2 rounded ${
                        activeTab === 'empresas' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    Empresas
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
                {renderContent()}
            </div>
        </div>
    );
};

export default ConfigTabs;
