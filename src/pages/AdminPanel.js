
import React, { useState } from 'react';
import ManageSuits from '../components/ManageSuits';
import ManageUsers from '../components/ManageUsers';
import ManageReports from '../components/ManageReports';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('suits');

  const renderContent = () => {
    switch (activeTab) {
      case 'suits':
        return <ManageSuits />;
      case 'users':
        return <ManageUsers />;
      case 'reports':
        return <ManageReports />;
      default:
        return <ManageSuits />;
    }
  };

  // Basic styling for tabs - feel free to customize
  const tabStyle = "py-2 px-4 font-semibold rounded-t-lg transition-colors duration-300 focus:outline-none";
  const activeTabStyle = "bg-primary text-on-primary";
  const inactiveTabStyle = "bg-surface-variant text-on-surface-variant hover:bg-primary/80 hover:text-on-primary";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-on-background">Panel de Administrador</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-outline-variant mb-6">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button 
            className={`${tabStyle} ${activeTab === 'suits' ? activeTabStyle : inactiveTabStyle}`}
            onClick={() => setActiveTab('suits')}
          >
            Trajes
          </button>
          <button 
            className={`${tabStyle} ${activeTab === 'users' ? activeTabStyle : inactiveTabStyle}`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
          <button 
            className={`${tabStyle} ${activeTab === 'reports' ? activeTabStyle : inactiveTabStyle}`}
            onClick={() => setActiveTab('reports')}
          >
            Reportes
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
