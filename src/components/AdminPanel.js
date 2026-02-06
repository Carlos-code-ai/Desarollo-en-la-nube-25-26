
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import ManageUsers from './ManageUsers';
import ManageSuits from './ManageSuits';
import ManageReports from './ManageReports';

const AdminPanel = () => {
    const { tab = 'users' } = useParams();

    const renderContent = () => {
        switch (tab) {
            case 'users':
                return <ManageUsers />;
            case 'suits':
                return <ManageSuits />;
            case 'reports':
                return <ManageReports />;
            default:
                return <h2 className='text-center text-2xl'>Sección no encontrada</h2>;
        }
    };

    const getTabClass = (tabName) => {
        return `py-3 px-5 font-semibold text-base transition-all duration-300 ease-in-out rounded-full ` +
               (tab === tabName
                ? 'bg-primary text-on-primary shadow-md'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high');
    };

    return (
        <div className="min-h-screen bg-surface-container-lowest text-on-surface">
            <AdminHeader />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-on-surface">Panel de Administración</h1>

                    <div className="mb-8">
                        <nav className="flex space-x-2 p-2 bg-surface-container rounded-full" aria-label="Tabs">
                            <Link to="/admin/users" className={getTabClass('users')}>
                                Usuarios
                            </Link>
                            <Link to="/admin/suits" className={getTabClass('suits')}>
                                Trajes
                            </Link>
                            <Link to="/admin/reports" className={getTabClass('reports')}>
                                Reportes
                            </Link>
                        </nav>
                    </div>

                    <div className="bg-surface p-6 rounded-3xl shadow-sm">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
