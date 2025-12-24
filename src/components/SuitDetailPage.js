
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase.js';
import { ref, onValue, push, query, orderByChild, equalTo, get, serverTimestamp, set, update } from 'firebase/database';
import useAuth from '../hooks/useAuth.js';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';

const HeartIcon = ({ isFavorite, onToggle }) => {
    return (
        <div 
            className="absolute top-4 right-4 z-10 h-10 w-10 grid place-items-center bg-background/70 backdrop-blur-sm rounded-full cursor-pointer transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'fill-red-500 stroke-red-600' : 'fill-none stroke-on-surface'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        </div>
    );
};

const DetailItem = ({ iconName, title, value }) => (
    <div className="flex flex-col items-center text-center p-3 bg-surface-container rounded-2xl">
        <span className="material-icons text-primary mb-1">{iconName}</span>
        <p className="text-xs text-on-surface-variant font-medium">{title}</p>
        <p className="text-sm font-semibold text-on-surface mt-0.5">{value}</p>
    </div>
);

const SuitDetailPage = ({ suitId, onBack, favorites, onToggleFavorite }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suit, setSuit] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const suitRef = ref(db, `trajes/${suitId}`);
    setLoading(true);

    const unsubscribeSuit = onValue(suitRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fullSuitData = { ...data, id: suitId };
        setSuit(fullSuitData);

        const ownerRef = ref(db, `users/${data.ownerId}`);
        onValue(ownerRef, (ownerSnapshot) => {
            const ownerData = ownerSnapshot.val();
            if (ownerData) {
                setOwner(ownerData);
            } else {
                setError('No se pudo encontrar al propietario del traje.');
            }
            setLoading(false);
        }, { onlyOnce: true });

      } else {
        setError('No se pudo encontrar el traje.');
        setLoading(false);
      }
    }, (err) => {
      console.error(err);
      setError('Error al cargar el traje.');
      setLoading(false);
    });

    const bookingsRef = query(ref(db, 'bookings'), orderByChild('suitId'), equalTo(suitId));
    const unsubscribeBookings = onValue(bookingsRef, (snapshot) => {
        const bookingsData = [];
        snapshot.forEach(childSnapshot => {
            const booking = childSnapshot.val();
            if (booking.status === 'accepted') {
                 bookingsData.push({ from: new Date(booking.startDate), to: new Date(booking.endDate) });
            }
        });
        setBookings(bookingsData);
    });

    return () => {
        unsubscribeSuit();
        unsubscribeBookings();
    };
  }, [suitId]);

  const today = new Date();
  const disabledDays = useMemo(() => {
      let disabled = [{ before: today }];
      bookings.forEach(booking => disabled.push({ from: booking.from, to: booking.to }));
      return disabled;
  }, [bookings]);

  useEffect(() => {
    if (dateRange.from && dateRange.to && suit && suit.price) {
        const diffTime = Math.abs(dateRange.to - dateRange.from);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setTotalPrice(diffDays * suit.price);
    } else {
        setTotalPrice(0);
    }
  }, [dateRange, suit]);
  
  const handleRentalRequest = async () => {
    setSubmitting(true);
    if (!user) { alert('Debes iniciar sesión para solicitar un alquiler.'); setSubmitting(false); return; }
    if (!dateRange.from || !dateRange.to) { alert('Por favor, selecciona un rango de fechas.'); setSubmitting(false); return; }
    if (!suit || !owner) { alert('Los datos del traje o del propietario no están cargados.'); setSubmitting(false); return; }
    if (user.uid === suit.ownerId) { alert('No puedes alquilar tu propio traje.'); setSubmitting(false); return; }

    try {
        const ownerId = suit.ownerId;
        const renterId = user.uid;

        const chatsRef = ref(db, 'chats');
        const q = query(chatsRef, orderByChild('suitId'), equalTo(suitId));
        const snapshot = await get(q);
        let existingChatId = null;

        if (snapshot.exists()) {
            const chats = snapshot.val();
            for (const chatId in chats) {
                if (chats[chatId].members && chats[chatId].members[renterId] && chats[chatId].members[ownerId]) {
                    existingChatId = chatId;
                    break;
                }
            }
        }

        const rootRef = ref(db);
        const updates = {};
        const newBookingRef = push(ref(db, 'bookings'));
        let chatIdToNavigate = existingChatId;

        if (!existingChatId) {
            const newChatRef = push(chatsRef);
            chatIdToNavigate = newChatRef.key;
            const newChat = {
                id: newChatRef.key,
                bookingId: newBookingRef.key,
                suitId: suit.id,
                suitName: suit.name,
                suitImageUrl: suit.imageUrl,
                lastMessage: 'Solicitud de alquiler enviada.',
                timestamp: serverTimestamp(),
                members: { [ownerId]: true, [renterId]: true },
                participantInfo: {
                    [ownerId]: { name: owner.displayName, photo: owner.photoURL },
                    [renterId]: { name: user.displayName, photo: user.photoURL }
                }
            };
            updates[`/chats/${newChatRef.key}`] = newChat;
        }
        
        const newBooking = {
            id: newBookingRef.key,
            chatId: chatIdToNavigate, // <-- VINCULACIÓN DEL CHAT ID
            suitId: suit.id,
            suitName: suit.name,
            suitImageUrl: suit.imageUrl,
            ownerId: ownerId,
            renterId: renterId,
            renterName: user.displayName,
            renterPhotoURL: user.photoURL,
            startDate: dateRange.from.toISOString(),
            endDate: dateRange.to.toISOString(),
            totalPrice: totalPrice,
            status: 'pending',
            createdAt: serverTimestamp()
        };
        updates[`/bookings/${newBookingRef.key}`] = newBooking;

        await update(rootRef, updates);
        navigate(`/messages/${chatIdToNavigate}`);

    } catch (error) {
        console.error("Error al procesar la solicitud de alquiler:", error);
        alert("Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.");
    } finally {
        setSubmitting(false);
    }
  };

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  const fullSuitData = suit && owner ? { ...suit, ownerName: owner.displayName, ownerPhotoURL: owner.photoURL } : null;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {loading && <div className="w-full h-screen grid place-items-center">...</div>}
      {error && <p className="text-center text-error font-medium">{error}</p>}
      {fullSuitData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-container shadow-lg">
                <button onClick={onBack} className="absolute top-4 left-4 z-10 h-10 w-10 grid place-items-center bg-background/70 backdrop-blur-sm rounded-full cursor-pointer transition-colors" aria-label="Volver">
                    <span className="material-icons text-on-surface">arrow_back</span>
                </button>
                <img src={fullSuitData.imageUrl} alt={fullSuitData.name} className="w-full h-full object-cover" />
                <HeartIcon isFavorite={favorites.has(fullSuitData.id)} onToggle={() => onToggleFavorite(fullSuitData.id)} />
            </div>

            <div className="mt-8 md:mt-0">
              <h1 className="text-4xl font-bold tracking-tight text-on-surface">{fullSuitData.name}</h1>
              {fullSuitData.ownerId && fullSuitData.ownerName && (
                  <Link to={`/user/${fullSuitData.ownerId}`} className="flex items-center space-x-3 mt-3 group">
                      <img src={fullSuitData.ownerPhotoURL} alt={fullSuitData.ownerName} className="h-10 w-10 rounded-full object-cover transition-transform group-hover:scale-110"/>
                      <span className="text-on-surface-variant font-medium text-sm group-hover:text-primary transition-colors">Alquilado por {fullSuitData.ownerName}</span>
                  </Link>
              )}

              <div className="mt-6"><p className="text-on-surface-variant leading-relaxed">{fullSuitData.description}</p></div>
              
              <div className="mt-8 p-6 bg-surface-container rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                       <h2 className="text-xl font-bold text-on-surface">Alquilar</h2>
                       <p className="text-2xl font-bold text-primary">{fullSuitData.price}€<span className="text-sm font-normal text-on-surface-variant">/día</span></p>
                  </div>

                  <div className="flex justify-center">
                      <DayPicker mode="range" locale={es} selected={dateRange} onSelect={setDateRange} disabled={disabledDays} numberOfMonths={1} styles={{ root: { width: '100%', backgroundColor: 'var(--color-surface)', borderRadius: '1rem', padding: '0.5rem' }, caption: { color: 'var(--color-primary)'}, day: { color: 'var(--color-on-surface)'}, day_selected: { backgroundColor: 'var(--color-primary) !important', color: 'var(--color-on-primary) !important'}, day_disabled: { color: 'var(--color-on-surface-variant)', opacity: 0.4 } }} />
                  </div>
                  
                   {totalPrice > 0 && 
                     <div className="p-4 bg-primary/10 rounded-xl text-center">
                       <p className="text-on-surface-variant">Precio total estimado:</p>
                       <p className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)}€</p>
                     </div>
                   }
              </div>

              <div className="mt-8 flex flex-col gap-4">
                  <button onClick={handleRentalRequest} disabled={!dateRange.from || !dateRange.to || submitting} className="w-full h-12 rounded-full bg-primary text-on-primary font-bold hover:scale-105 transition-transform disabled:bg-on-surface/10 disabled:text-on-surface/50 disabled:scale-100">
                      {submitting ? 'Enviando Solicitud...' : 'Solicitar Alquiler y Chatear'}
                  </button>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-outline/20">
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {fullSuitData.size && <DetailItem iconName="straighten" title="Talla" value={fullSuitData.size} />}
                   {fullSuitData.eventType && <DetailItem iconName="celebration" title="Evento" value={capitalize(fullSuitData.eventType)} />}
                   {fullSuitData.condition && <DetailItem iconName="check_circle" title="Condición" value={capitalize(fullSuitData.condition)} />}
                   {fullSuitData.colors && <DetailItem iconName="palette" title="Color" value={capitalize(fullSuitData.colors)} />}
               </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuitDetailPage;
