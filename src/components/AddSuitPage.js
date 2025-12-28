
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push, serverTimestamp } from 'firebase/database';
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import useAuth from '../hooks/useAuth.js';
import AddSuitForm from './AddSuitForm.js';
import { rtdb } from '../firebase.js';

const AddSuitPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/profile');
    };

    const handleAddSuit = async (suitData) => {
        if (!currentUser) {
            setError('Debes iniciar sesión para añadir un traje.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const uploadedImageUrls = [];
            for (const img of suitData.imageUrls) {
                if (img.startsWith('data:image')) {
                    const newImageRef = storageRef(getStorage(), `trajes/${currentUser.uid}/${Date.now()}`);
                    const uploadResult = await uploadString(newImageRef, img, 'data_url');
                    const downloadUrl = await getDownloadURL(uploadResult.ref);
                    uploadedImageUrls.push(downloadUrl);
                } else {
                    uploadedImageUrls.push(img);
                }
            }

            const finalSuitData = {
                ...suitData,
                imageUrls: uploadedImageUrls,
                imageUrl: uploadedImageUrls[0] || '',
                ownerId: currentUser.uid,
                createdAt: serverTimestamp(),
                isAvailable: true,
                price: Number(suitData.price) || 0,
            };
            
            const suitsRef = ref(rtdb, 'trajes');
            await push(suitsRef, finalSuitData);

            setIsLoading(false);
            navigate('/profile');

        } catch (err) {
            console.error("Error adding suit:", err);
            setError('Hubo un error al guardar el traje. Por favor, inténtalo de nuevo.');
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 {error && (
                    <div className="bg-error-container text-on-error-container p-4 rounded-lg mb-6">
                        <p>{error}</p>
                    </div>
                )}
                <AddSuitForm 
                    onSubmit={handleAddSuit} 
                    onCancel={handleCancel} 
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default AddSuitPage;
