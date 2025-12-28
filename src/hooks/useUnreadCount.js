import { useState, useEffect } from 'react';
import { rtdb } from '../firebase.js'; // CRITICAL FIX: Use rtdb, not db
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

const useUnreadCount = (userId) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) {
            setUnreadCount(0);
            return;
        }

        // CRITICAL FIX: Use rtdb instance for Realtime Database query
        const chatsRef = query(ref(rtdb, 'chats'), orderByChild(`members/${userId}`), equalTo(true));

        const unsubscribe = onValue(chatsRef, (snapshot) => {
            const chatsData = snapshot.val();
            let totalUnread = 0;
            if (chatsData) {
                Object.values(chatsData).forEach(chat => {
                    // Defensive check for chat.unreadCount and the specific user's count
                    if (chat && chat.unreadCount && typeof chat.unreadCount[userId] === 'number') {
                        totalUnread += chat.unreadCount[userId];
                    }
                });
            }
            setUnreadCount(totalUnread);
        }, (error) => {
            console.error("Error fetching unread chat count:", error);
            setUnreadCount(0); // Reset on error
        });

        return () => unsubscribe();
    }, [userId]);

    return unreadCount;
};

export default useUnreadCount;