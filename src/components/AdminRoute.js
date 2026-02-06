import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdmin from '../hooks/useAdmin';

const AdminRoute = ({ children }) => {
    const { isAdmin, loading } = useAdmin();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;