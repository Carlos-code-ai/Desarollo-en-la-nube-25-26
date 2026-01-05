import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rtdb } from '../firebase.js';
import { ref, onValue, push, update, serverTimestamp, query, orderByChild, equalTo, increment } from 'firebase/database';
import useAuth from '../hooks/useAuth.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getOtherUserId = (chat, currentUser) => {
    if (!chat || !chat.members || !currentUser) return null;
    const members = Array.isArray(chat.members) ? chat.members : Object.keys(chat.members);
    return members.find(id => id !== currentUser.uid);
};

const BookingStatusDisplay = ({ booking, isOwner, onUpdateStatus }) => {
    if (!booking) return null;

    const { startDate, endDate, totalPrice, status } = booking;
    const formattedStartDate = startDate ? format(new Date(startDate), "d MMM yyyy", { locale: es }) : '';
    const formattedEndDate = endDate ? format(new Date(endDate), "d MMM yyyy", { locale: es }) : '';

    const getStatusInfo = () => {
        switch (status) {
            case 'accepted': return { text: 'Solicitud Aceptada', style: 'bg-green-500/20 text-green-700', icon: 'check_circle' };
            case 'rejected': return { text: 'Solicitud Rechazada', style: 'bg-red-500/20 text-red-700', icon: 'cancel' };
            default: return null;
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="p-3 bg-surface-container rounded-t-xl border-b border-outline/30">
            <div className="flex flex-wrap items-center justify-between gap-y-2">
                <div className="flex flex-col">
                     <span className="text-xs text-on-surface-variant">Solicitud de Alquiler</span>
                     <span className="font-bold text-on-surface text-sm">{formattedStartDate} - {formattedEndDate}</span>
                </div>
                <span className="font-bold text-primary text-lg">{(totalPrice || 0).toFixed(2)}€</span>
            </div>
            {isOwner && status === 'pending' && (
                <div className="flex gap-2 mt-3">
                    <button onClick={() => onUpdateStatus('accepted')} className="flex-1 h-9 flex items-center justify-center gap-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-bold">
                        <span className="material-icons text-lg">check</span>
                        <span>Aceptar</span>
                    </button>
                    <button onClick={() => onUpdateStatus('rejected')} className="flex-1 h-9 flex items-center justify-center gap-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-bold">
                        <span className="material-icons text-lg">close</span>
                        <span>Rechazar</span>
                    </button>
                </div>
            )}
            {statusInfo && (
                 <div className={`mt-3 p-2 rounded-lg flex items-center justify-center text-sm font-bold ${statusInfo.style}`}>
                    <span className="material-icons text-lg mr-2">{statusInfo.icon}</span>
                    {statusInfo.text}
                </div>
            )}
        </div>
    );
};

const ChatView = ({ chatId }) => {
    const { user, loading: authLoading } = useAuth(); // Destructure loading state from useAuth
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatInfo, setChatInfo] = useState(null);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const messagesEndRef = useRef(null);
    const messageContainerRef = useRef(null);

    useEffect(() => {
        if (!chatId || authLoading) {
            setLoading(true);
            return;
        }

        setLoading(true);
        setMessages([]);

        const chatRef = ref(rtdb, `chats/${chatId}`);
        
        if (user?.uid) {
            const unreadCountRef = ref(rtdb, `chats/${chatId}/unreadCount/${user.uid}`);
            update(ref(rtdb), { [unreadCountRef.path]: 0 }).catch(err => console.error("Failed to reset unread count", err));
        }

        const unsubscribeChat = onValue(chatRef, (snapshot) => {
            const chatData = snapshot.val();
            setChatInfo(chatData);
            if (chatData?.bookingId) {
                const bookingRef = ref(rtdb, `bookings/${chatData.bookingId}`);
                onValue(bookingRef, (bookingSnapshot) => setBooking({ id: bookingSnapshot.key, ...bookingSnapshot.val() }));
            }
            setLoading(false);
        }, () => setLoading(false));

        const messagesRef = query(ref(rtdb, `messages/${chatId}`), orderByChild('timestamp'));
        const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
            const msgs = [];
            snapshot.forEach(childSnapshot => msgs.push({ id: childSnapshot.key, ...childSnapshot.val() }));
            setMessages(msgs);
        });

        return () => {
            unsubscribeChat();
            unsubscribeMessages();
        };
    }, [chatId, user?.uid, authLoading]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (newMessage.trim() === '' || !user || !chatInfo) return;
        
        const otherUserId = getOtherUserId(chatInfo, user);
        if (!otherUserId) return;

        const messageData = { senderId: user.uid, text: newMessage, timestamp: serverTimestamp() };
        const updates = {};
        const newMessageKey = push(ref(rtdb, `messages/${chatId}`)).key;

        updates[`/messages/${chatId}/${newMessageKey}`] = messageData;
        updates[`/chats/${chatId}/lastMessage`] = newMessage;
        updates[`/chats/${chatId}/timestamp`] = serverTimestamp();
        updates[`/chats/${chatId}/unreadCount/${otherUserId}`] = increment(1);

        await update(ref(rtdb), updates);
        setNewMessage('');
    };

    const handleUpdateBookingStatus = async (newStatus) => {
        if (!booking) return;
        const bookingRef = ref(rtdb, `bookings/${booking.id}`);
        const systemMessage = `La solicitud ha sido ${newStatus === 'accepted' ? 'aceptada' : 'rechazada'}.`;
        
        const messageData = { senderId: 'system', text: systemMessage, timestamp: serverTimestamp(), isSystem: true };
        const newMessageKey = push(ref(rtdb, `messages/${chatId}`)).key;

        const updates = {};
        updates[`/bookings/${booking.id}/status`] = newStatus;
        updates[`/messages/${chatId}/${newMessageKey}`] = messageData;
        updates[`/chats/${chatId}/lastMessage`] = systemMessage;

        await update(ref(rtdb), updates);
    };
    
    if (loading || authLoading) return <div className="h-full grid place-items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
    if (!chatInfo) return <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-surface-container-low rounded-2xl"><span className="material-icons text-error text-8xl mb-4">error_outline</span><h2 className="text-xl font-bold text-on-surface mb-2">Error al cargar el chat</h2><p className="text-on-surface-variant max-w-sm">No se pudo encontrar la conversación.</p></div>;
    
    const otherUserId = getOtherUserId(chatInfo, user);
    const otherUser = (otherUserId && chatInfo.participantInfo?.[otherUserId]) || { name: 'Usuario', photo: '' };
    const isOwner = booking && user && booking.ownerId === user.uid;

    return (
        <div className="flex flex-col h-full bg-surface-container-low rounded-2xl relative">
            <Link to={`/user/${otherUserId}`} className="flex items-center p-3 border-b border-outline/30 rounded-t-2xl hover:bg-surface-container transition-colors">
                <img src={otherUser.photo} alt={otherUser.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                <div className="flex-grow">
                    <h3 className="font-bold text-on-surface">{otherUser.name}</h3>
                    <p className="text-sm text-on-surface-variant truncate">{chatInfo.suitName}</p>
                </div>
            </Link>

            {booking && <BookingStatusDisplay booking={booking} isOwner={isOwner} onUpdateStatus={handleUpdateBookingStatus} />}

            <div ref={messageContainerRef} className="flex-grow p-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex my-2 ${msg.isSystem ? 'justify-center' : (msg.senderId === user.uid ? 'justify-end' : 'justify-start')}`}>
                         {msg.isSystem ? (
                            <div className="px-3 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant">{msg.text}</div>
                         ) : (
                            <div className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md ${msg.senderId === user.uid ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                         )}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-surface-container rounded-b-2xl">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escribe tu mensaje..." className="flex-grow p-3 rounded-full bg-surface border border-outline focus:ring-2 focus:ring-primary focus:outline-none transition" />
                    <button type="submit" className="h-12 w-12 grid place-items-center rounded-full bg-primary text-on-primary hover:scale-110 transition-transform disabled:bg-surface-container-high" disabled={!newMessage.trim()}><span className="material-icons">send</span></button>
                </form>
            </div>
        </div>
    );
};

const ChatListItem = ({ chat, active, onClick }) => {
    const { user } = useAuth();
    if (!chat || !user) return null; 

    const otherUserId = getOtherUserId(chat, user);
    if (!otherUserId || !chat.participantInfo?.[otherUserId]) {
        return null; 
    }
    const otherUser = chat.participantInfo[otherUserId];
    const unreadCount = chat.unreadCount?.[user.uid] || 0;

    return (
        <div onClick={onClick} className={`flex items-center p-3 rounded-2xl cursor-pointer transition-colors ${active ? 'bg-primary/10' : 'hover:bg-surface-container'}`}>
            <img src={otherUser.photo} alt={otherUser.name} className="w-12 h-12 rounded-full mr-4 object-cover"/>
            <div className="flex-grow overflow-hidden">
                 <div className="flex justify-between items-start">
                    <h4 className="font-bold text-on-surface truncate">{otherUser.name}</h4>
                    {unreadCount > 0 && (
                        <span className="flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-primary text-on-primary text-xs font-bold ml-2">
                           {unreadCount}
                        </span>
                    )}
                </div>
                <p className={`text-sm mt-0.5 truncate ${unreadCount > 0 ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                    {chat.lastMessage || 'Haz clic para chatear'}
                </p>
            </div>
        </div>
    );
};

const MessagesPage = () => {
    const { user, loading: authLoading } = useAuth(); // Use auth loading state
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !user) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        const userChatsRef = ref(rtdb, `users/${user.uid}/chats`);


        const unsubscribe = onValue(userChatsRef, (snapshot) => {
            const userChatIds = snapshot.val() || {};
            const chatPromises = Object.keys(userChatIds).map(chatId => {
                return new Promise((resolve) => {
                    const chatRef = ref(rtdb, `chats/${chatId}`);
                    onValue(chatRef, (chatSnapshot) => {
                        resolve({ id: chatSnapshot.key, ...chatSnapshot.val() });
                    }, () => resolve(null));
                });
            });

            Promise.all(chatPromises).then(userChats => {
                const validChats = userChats.filter(Boolean);
                validChats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                setChats(validChats);
                setLoading(false);
            });

        }, () => setLoading(false));

        return () => unsubscribe();
    }, [user, authLoading]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100vh-10rem)] py-4 animate-fade-in">
                <div className="md:col-span-1 lg:col-span-1 bg-surface-container p-2 rounded-2xl overflow-y-auto space-y-2">
                    <h2 className="text-xl font-bold text-on-surface p-3">Conversaciones</h2>
                    {(loading || authLoading) && <div className="p-3 text-center text-on-surface-variant">Cargando chats...</div>}
                    {!loading && !authLoading && chats.length === 0 && (
                        <div className="p-4 text-center text-on-surface-variant">
                            Aún no tienes conversaciones. Inicia una al solicitar el alquiler de un traje.
                        </div>
                    )}
                    {chats.map(chat => (
                        <ChatListItem 
                            key={chat.id} 
                            chat={chat} 
                            active={chatId === chat.id} 
                            onClick={() => navigate(`/messages/${chat.id}`)} 
                        />
                    ))}
                </div>
                <div className="md:col-span-2 lg:col-span-3 h-full">
                    {chatId ? <ChatView chatId={chatId} /> : <NoChatSelected />}
                </div>
            </div>
        </div>
    );
};

const NoChatSelected = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-surface-container-low rounded-2xl">
        <span className="material-icons text-on-surface-variant/50 text-8xl mb-4">chat</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">Selecciona un chat</h2>
        <p className="text-on-surface-variant max-w-sm">
            Elige una conversación de la lista para ver los mensajes o inicia un nuevo chat desde la página de un traje.
        </p>
    </div>
);

export default MessagesPage;
