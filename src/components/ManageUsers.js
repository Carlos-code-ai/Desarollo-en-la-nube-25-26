
import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { rtdb } from '../firebase';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingRowId, setEditingRowId] = useState(null);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        const usersRef = ref(rtdb, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const userList = Object.keys(data).map(key => ({ ...data[key], uid: key }));
                setUsers(userList);
            } else {
                setUsers([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase read error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-lg font-semibold text-on-surface-variant">Cargando usuarios...</p>
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
                                            <select name="role" value={editedData.role} onChange={handleInputChange} className="w-full p-2 bg-surface-container-lowest border border-outline rounded-lg">
                                                <option value="usuario">Usuario</option>
                                                <option value="admin">Admin</option>
                                            </select>
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
