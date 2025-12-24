import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';

const useUnreadCount = (userId) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) {
            setUnreadCount(0);
            return;
        }

        const chatsRef = query(ref(db, 'chats'), orderByChild(`members/${userId}`), equalTo(true));

        const unsubscribe = onValue(chatsRef, (snapshot) => {
            const chatsData = snapshot.val();
            let totalUnread = 0;
            if (chatsData) {
                Object.values(chatsData).forEach(chat => {
                    if (chat.unreadCount && chat.unreadCount[userId]) {
                        totalUnread += chat.unreadCount[userId];
                    }
                });
            }
            setUnreadCount(totalUnread);
        });

        return () => unsubscribe();
    }, [userId]);

    return unreadCount;
};

export default useUnreadCount;