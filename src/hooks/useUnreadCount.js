import { useState, useEffect } from 'react';
import { rtdb } from '../firebase.js';
import { ref, onValue } from 'firebase/database';

const useUnreadCount = (userId) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) {
            setUnreadCount(0);
            return;
        }

        const userChatsRef = ref(rtdb, `users/${userId}/chats`);
        let chatListeners = [];
        const chatDataMap = new Map();

        const recomputeTotal = () => {
            let total = 0;
            for (const chat of chatDataMap.values()) {
                if (chat && chat.unreadCount && chat.unreadCount[userId]) {
                    total += chat.unreadCount[userId];
                }
            }
            setUnreadCount(total);
        };

        const userChatsListener = onValue(userChatsRef, (snapshot) => {
            // Clean up old chat listeners
            chatListeners.forEach(unsubscribe => unsubscribe());
            chatListeners = [];
            chatDataMap.clear();

            const chatIds = snapshot.val() ? Object.keys(snapshot.val()) : [];
            
            if (chatIds.length === 0) {
                setUnreadCount(0);
                return;
            }

            chatIds.forEach(chatId => {
                const chatRef = ref(rtdb, `chats/${chatId}`);
                const chatListener = onValue(chatRef, (chatSnapshot) => {
                    const chatData = chatSnapshot.val();
                    if (chatData) {
                        chatDataMap.set(chatId, chatData);
                    } else {
                        chatDataMap.delete(chatId);
                    }
                    recomputeTotal();
                }, (error) => {
                    console.error(`Error fetching data for chat ${chatId}:`, error);
                });
                chatListeners.push(chatListener);
            });
        }, (error) => {
            console.error("Error fetching user's chat list:", error);
            setUnreadCount(0);
        });

        return () => {
            userChatsListener();
            chatListeners.forEach(unsubscribe => unsubscribe());
        };

    }, [userId]);

    return unreadCount;
};

export default useUnreadCount;
