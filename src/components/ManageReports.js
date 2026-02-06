
import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { rtdb } from '../firebase';

const ManageReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const reportsRef = ref(rtdb, 'reports');
        const unsubscribe = onValue(reportsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const reportList = Object.keys(data).map(key => ({ ...data[key], id: key }));
                setReports(reportList);
            } else {
                setReports([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firebase read error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleMarkAsResolved = (id) => {
        const reportRef = ref(rtdb, `reports/${id}`);
        update(reportRef, { status: 'Resuelto' })
            .catch(error => console.error("Error updating report:", error));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-lg font-semibold text-on-surface-variant">Cargando reportes...</p>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-on-surface">Gestionar Reportes</h2>

            {reports.length === 0 ? (
                <p className="text-on-surface-variant">No hay reportes para mostrar.</p>
            ) : (
                <div className="space-y-4">
                    {reports.map(report => (
                        <div key={report.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-on-surface">Reporte de <span className="text-primary">{report.reportedBy}</span></p>
                                <p className="text-sm text-on-surface-variant">Ítem: {report.reportedItemId}</p>
                                <p className="text-sm text-on-surface-variant">Motivo: {report.reason}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${report.status === 'Pendiente' ? 'bg-warning-container text-on-warning-container' : 'bg-success-container text-on-success-container'}`}>
                                    {report.status}
                                </span>
                                <button className="px-4 py-2 rounded-full bg-tertiary-container text-on-tertiary-container font-semibold hover:bg-tertiary-container-high transition-colors">Ver Detalle</button>
                                {report.status === 'Pendiente' && (
                                    <button onClick={() => handleMarkAsResolved(report.id)} className="px-4 py-2 rounded-full bg-primary text-on-primary font-semibold hover:bg-primary-dark transition-colors">Marcar como Resuelto</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageReports;
