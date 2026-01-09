import { useState, useEffect } from 'react';
import { ref, query, onValue, orderByChild, equalTo, get } from 'firebase/database';
import { rtdb } from '../firebase.js';

const useUserBookings = (userId) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);

        try {
            const bookingsRef = ref(rtdb, 'bookings');
            
            // Create queries
            const ownerQuery = query(bookingsRef, orderByChild('ownerId'), equalTo(userId));
            const renterQuery = query(bookingsRef, orderByChild('renterId'), equalTo(userId));

            // Execute queries in parallel
            const [ownerSnapshot, renterSnapshot] = await Promise.all([
                get(ownerQuery),
                get(renterQuery)
            ]);

            const ownerData = ownerSnapshot.val() || {};
            const renterData = renterSnapshot.val() || {};

            // Combine data, ensuring no duplicates
            const combinedData = { ...ownerData, ...renterData };

            const allBookingsList = Object.keys(combinedData).map(key => ({ 
                id: key, 
                ...combinedData[key] 
            }));

            // Sort by creation date, newest first
            const sorted = allBookingsList.sort((a, b) => 
              (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
            );

            setBookings(sorted);
            setError(null);

        } catch (e) {
            console.error("Error fetching user bookings:", e);
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    fetchBookings();

    // Optional: Set up real-time listeners if needed in the future,
    // but for now, a direct fetch is simpler and less prone to race conditions.

  }, [userId]);

  return { bookings, loading, error };
};

export default useUserBookings;
