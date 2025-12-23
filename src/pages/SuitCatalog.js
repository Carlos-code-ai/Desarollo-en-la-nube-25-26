import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../firebase.js'; 
import SuitCard from '../components/SuitCard.js';

const SuitCatalog = () => {
    const [suits, setSuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const suitsRef = ref(db, 'trajes');
        const listener = onValue(suitsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const suitsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setSuits(suitsArray);
            } else {
                setSuits([]);
            }
            setLoading(false);
        }, (error) => {
            setError('Failed to fetch suits.');
            console.error(error);
            setLoading(false);
        });

        // Cleanup function to remove the listener when the component unmounts
        return () => {
            listener();
        };
    }, []);

    const handleDelete = async (suitId) => {
        if (window.confirm('Are you sure you want to delete this suit?')) {
            try {
                const suitRef = ref(db, `trajes/${suitId}`);
                await remove(suitRef);
            } catch (error) {
                console.error('Error deleting suit:', error);
                alert('Failed to delete suit. Please try again.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div className="w3-container w3-margin-bottom">
                <Link to="/add-suit" className="w3-button w3-dark-grey">Add New Suit</Link>
            </div>
            <div className="w3-row-padding">
                {suits.map((suit) => (
                    <div key={suit.id} className="w3-col l3 m6 w3-margin-bottom">
                        <SuitCard suit={suit} onDelete={handleDelete} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuitCatalog;
