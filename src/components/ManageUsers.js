
import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { rtdb } from '../firebase';
import ModernDropdown from './ModernDropdown';
import useAdmin from '../hooks/useAdmin'; // Import useAdmin

const ManageUsers = () => {
    const { isAdmin, loading: adminLoading } = useAdmin(); // Use the hook
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    const userRoles = [
        { label: 'Usuario', value: 'usuario' },
        { label: 'Admin', value: 'admin' }
    ];

    useEffect(() => {
        // Wait for admin check to complete, and only proceed if user is admin
        if (adminLoading) {
            setLoading(true);
            return;
        }

        if (!isAdmin) {
            setError("Acceso denegado. No tienes permiso para ver los usuarios.");
            setLoading(false);
            return;
        }

        const usersRef = ref(rtdb, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userList = Object.keys(data).map(key => ({ ...data[key], uid: key }));
                setUsers(userList);
                setError(null); // Clear any previous errors
            } else {
                setUsers([]);
            }
            setLoading(false);
        }, (err) => {
            console.error("Firebase read error:", err);
            setError(err.message.includes("permission_denied") 
                ? "Acceso denegado. No tienes permiso para ver los usuarios."
                : "Ocurrió un error al cargar los usuarios.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAdmin, adminLoading]); // Add dependencies

    const handleDelete = (uid) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            remove(ref(rtdb, `users/${uid}`))
                .catch(error => console.error("Error deleting user:", error));
        }
    };

    const handleEdit = (user) => {
        setEditingRowId(user.uid);
        setEditedData({ ...user });
    };

    const handleCancel = () => {
        setEditingRowId(null);
        setEditedData({});
    };

    const handleSave = (uid) => {
        const userRef = ref(rtdb, `users/${uid}`);
        update(userRef, editedData)
            .then(() => {
                setEditingRowId(null);
                setEditedData({});
            })
            .catch(error => console.error("Error updating user:", error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (roleValue) => {
        setEditedData(prev => ({ ...prev, role: roleValue }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-lg font-semibold text-on-surface-variant">Cargando usuarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 bg-error-container rounded-2xl shadow-md">
                 <svg className="w-16 h-16 text-on-error-container mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-xl font-bold text-on-error-container">Error</p>
                <p className="text-md text-center text-on-error-container mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-on-surface">Usuarios Registrados</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-on-surface-variant">
                    <thead className="border-b border-outline-variant">
                        <tr className="text-on-surface font-semibold">
                            <th className="p-4">Email</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.uid} className="border-b border-surface-container-high hover:bg-surface-container">
                                {editingRowId === user.uid ? (
                                    <>
                                        <td className="p-4"><input name="email" value={editedData.email} onChange={handleInputChange} className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg" /></td>
                                        <td className="p-4"><input name="displayName" value={editedData.displayName} onChange={handleInputChange} className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg" /></td>
                                        <td className="p-4">
                                            <ModernDropdown
                                                name="role"
                                                options={userRoles}
                                                selected={editedData.role}
                                                onSelect={handleRoleChange}
                                            />
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleSave(user.uid)} className="px-4 py-2 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors">Guardar</button>
                                            <button onClick={handleCancel} className="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-semibold hover:bg-secondary-container-high transition-colors">Cancelar</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-4">{user.email}</td>
                                        <td className="p-4">{user.displayName}</td>
                                        <td className="p-4 capitalize">{user.role}</td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => handleEdit(user)} className="px-4 py-2 rounded-full bg-tertiary-container text-on-tertiary-container font-semibold hover:bg-tertiary-container-high transition-colors">Editar</button>
                                            <button onClick={() => handleDelete(user.uid)} className="px-4 py-2 rounded-full bg-error-container text-on-error-container font-semibold hover:bg-error-container-high transition-colors">Borrar</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
