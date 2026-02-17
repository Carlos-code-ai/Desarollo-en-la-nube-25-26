import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rtdb } from '../firebase.js';
import { ref, onValue, get, push, query, orderByChild, equalTo, serverTimestamp, update } from 'firebase/database';
import useAuth from '../hooks/useAuth.js';
import HeartIcon from './HeartIcon';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';
import emailjs from 'emailjs-com';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjY2NjIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==";
const avatarPlaceholder = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || ' ')}&background=random`;

const DetailItem = ({ iconName, title, value }) => (
    <div className="flex items-start text-left p-3 bg-surface-container rounded-2xl">
        <span className="material-icons-outlined text-primary mt-0.5">{iconName}</span>
        <div className="ml-3">
            <p className="text-sm text-on-surface-variant font-medium">{title}</p>
            <p className="text-base font-semibold text-on-surface">{value}</p>
        </div>
    </div>
);

const SuitDetailPage = () => {
  const { suitId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [suit, setSuit] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchSuitAndOwner = async () => {
        setLoading(true);
        try {
            const suitRef = ref(rtdb, `trajes/${suitId}`);
            const suitSnapshot = await get(suitRef);

            if (!suitSnapshot.exists()) {
                throw new Error("No se pudo encontrar el traje.");
            }

            const suitData = { ...suitSnapshot.val(), id: suitId };
            setSuit(suitData);

            if (suitData.ownerId) {
                const ownerRef = ref(rtdb, `users/${suitData.ownerId}`);
                const ownerSnapshot = await get(ownerRef);
                if (ownerSnapshot.exists()) {
                    setOwner(ownerSnapshot.val());
                } else {
                    console.warn("Owner not found for ownerId:", suitData.ownerId);
                    setOwner(null);
                }
            } else {
                setOwner(null);
            }
            setError(null);
        } catch (err) {
            console.error("Error loading suit and owner:", err);
            setError(err.message);
            setSuit(null);
            setOwner(null);
        } finally {
            setLoading(false);
        }
    };

    fetchSuitAndOwner();
  }, [suitId]);

   useEffect(() => {
    const bookingsRef = query(ref(rtdb, 'bookings'), orderByChild('suitId'), equalTo(suitId));
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
    return () => unsubscribeBookings();
  }, [suitId]);

  const today = useMemo(() => new Date(), []);

  const disabledDays = useMemo(() => {
      let disabled = [{ before: today }];
      bookings.forEach(booking => disabled.push({ from: booking.from, to: booking.to }));
      return disabled;
  }, [bookings, today]);

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
    if (!suit || !owner) { alert('Los datos del traje o del propietario no están completamente cargados.'); setSubmitting(false); return; }
    if (!owner.email) { alert('El propietario no tiene un email registrado para recibir notificaciones.'); setSubmitting(false); return; }
    if (user.uid === suit.ownerId) { alert('No puedes alquilar tu propio traje.'); setSubmitting(false); return; }

    try {
        const ownerId = suit.ownerId;
        const renterId = user.uid;
        const memberKey = renterId < ownerId ? `${renterId}_${ownerId}` : `${ownerId}_${renterId}`;

        const chatsRef = ref(rtdb, 'chats');
        const chatQuery = query(chatsRef, orderByChild('memberKey_suitId'), equalTo(`${memberKey}_${suitId}`));
        const snapshot = await get(chatQuery);
        let existingChatId = snapshot.exists() ? Object.keys(snapshot.val())[0] : null;

        const rootRef = ref(rtdb);
        const updates = {};
        const newBookingRef = push(ref(rtdb, 'bookings'));
        let chatIdToNavigate = existingChatId;
        
        const safeRenterName = user.displayName || user.email || "Usuario anónimo";
        const safeOwnerName = owner.displayName || "Propietario";

        if (!existingChatId) {
            const newChatRef = push(chatsRef);
            chatIdToNavigate = newChatRef.key;
            const newChat = {
                id: newChatRef.key, memberKey_suitId: `${memberKey}_${suitId}`, bookingId: newBookingRef.key, suitId: suit.id, suitName: suit.name, suitImageUrl: suit.imageUrl || placeholderImage,
                lastMessage: 'Solicitud de alquiler enviada.', timestamp: serverTimestamp(), members: { [ownerId]: true, [renterId]: true },
                participantInfo: { [ownerId]: { name: safeOwnerName, photo: owner.photoURL || avatarPlaceholder(safeOwnerName) }, [renterId]: { name: safeRenterName, photo: user.photoURL || avatarPlaceholder(safeRenterName) }}
            };
            updates[`/chats/${newChatRef.key}`] = newChat;
            updates[`/users/${ownerId}/chats/${newChatRef.key}`] = true;
            updates[`/users/${renterId}/chats/${newChatRef.key}`] = true;
        }
        
        const newBooking = {
            id: newBookingRef.key, chatId: chatIdToNavigate, suitId: suit.id, suitName: suit.name, suitImageUrl: suit.imageUrl || placeholderImage, ownerId: ownerId, renterId: renterId, 
            renterName: safeRenterName, renterPhotoURL: user.photoURL || avatarPlaceholder(safeRenterName), startDate: dateRange.from.toISOString(), endDate: dateRange.to.toISOString(),
            totalPrice: totalPrice, status: 'pending', createdAt: serverTimestamp()
        };
        updates[`/bookings/${newBookingRef.key}`] = newBooking;

        await update(rootRef, updates);
        
        const templateParams = { 
            to_name: safeOwnerName, 
            from_name: safeRenterName, 
            suit_name: suit.name, 
            start_date: dateRange.from.toLocaleDateString('es-ES'),
            end_date: dateRange.to.toLocaleDateString('es-ES'), 
            total_price: totalPrice.toFixed(2), 
            to_email: owner.email, 
            message: `Has recibido una nueva solicitud de alquiler para tu traje "${suit.name}".` 
        };

        try {
          await emailjs.send('service_plqoo8i', 'template_w94l9ye', templateParams, 'erV9otEs6I4ApvUyj');
        } catch (err) {
           console.error('Email send failed:', err);
        }

        navigate(`/messages/${chatIdToNavigate}`);
    } catch (error) {
        console.error("Error al procesar la solicitud de alquiler:", error);
        alert("Hubo un error al enviar tu solicitud.");
    } finally {
        setSubmitting(false);
    }
  };

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  if (loading) return <div className="w-full h-screen grid place-items-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
  if (error || !suit) return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center"><p className="text-error font-medium py-10">{error || 'No se ha podido cargar el traje.'}</p></div>;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-12 lg:gap-x-16">
          <div className="lg:col-span-3">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container shadow-xl sticky top-24">
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-20 h-11 w-11 grid place-items-center bg-background/60 backdrop-blur-sm rounded-full cursor-pointer transition-all hover:bg-background/80" aria-label="Volver">
                    <span className="material-icons text-on-surface">arrow_back</span>
                </button>
                <img src={suit.imageUrl || placeholderImage} alt={suit.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }} />
                <HeartIcon suitId={suit.id} />
                {owner && (
                    <Link to={`/user/${suit.ownerId}`} className="absolute bottom-4 left-4 z-10 group flex items-center space-x-3">
                        <img src={owner.photoURL || avatarPlaceholder(owner.displayName)} alt={owner.displayName || 'Propietario'} className="h-12 w-12 rounded-full object-cover border-2 border-white/80 shadow-lg transition-transform transform group-hover:scale-110 duration-300 ease-in-out" onError={(e) => { e.target.onerror = null; e.target.src=avatarPlaceholder(owner.displayName); }} />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white text-xs px-2 py-1 rounded-md absolute left-16 whitespace-nowrap">Ver perfil de {owner.displayName || 'Propietario'}</div>
                    </Link>
                )}
            </div>
          </div>
          <div className="lg:col-span-2 mt-8 lg:mt-0 flex flex-col space-y-8">
              <div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-on-surface">{suit.name}</h1>
                  {suit.brand && <p className="text-xl text-on-surface-variant mt-1">por {suit.brand}</p>}
              </div>
              <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-on-surface">Características</h2>
                  <div className="grid grid-cols-2 gap-4">
                      {suit.size && <DetailItem iconName="straighten" title="Talla" value={suit.size.toUpperCase()} />}
                      {suit.colors && <DetailItem iconName="palette" title="Color" value={capitalize(suit.colors)} />}
                      {suit.eventType && <DetailItem iconName="celebration" title="Evento Ideal" value={capitalize(suit.eventType)} />}
                      {suit.condition && <DetailItem iconName="verified" title="Condición" value={capitalize(suit.condition)} />}
                  </div>
              </div>
              {suit.description && (
                  <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-on-surface">Sobre este traje</h2>
                      <div className="prose prose-lg text-on-surface-variant leading-relaxed"><p>{suit.description}</p></div>
                  </div>
              )}
              <div className="p-5 bg-surface-container rounded-3xl shadow-lg">
                  <div className="flex justify-between items-center">
                       <h2 className="text-2xl font-bold text-on-surface">Alquilar</h2>
                       <p className="text-3xl font-bold text-primary">{suit.price}€<span className="text-base font-normal text-on-surface-variant">/día</span></p>
                  </div>
                  <div className="flex justify-center mt-4"><DayPicker mode="range" locale={es} selected={dateRange} onSelect={setDateRange} disabled={disabledDays} numberOfMonths={1} className="w-full" classNames={{ caption_label: 'text-primary font-semibold', day: 'text-on-surface', day_selected: '!bg-primary !text-on-primary', day_disabled: 'opacity-30'}} /></div>
                   {totalPrice > 0 && <div className="mt-4 p-3 bg-primary/10 rounded-xl text-center"><p className="text-md text-on-surface-variant">Precio total estimado:</p><p className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)}€</p></div>}
              </div>
              <div className="pt-2">
                  <button onClick={handleRentalRequest} disabled={!dateRange.from || !dateRange.to || submitting || !owner} className="w-full h-14 rounded-full bg-primary text-on-primary font-bold text-lg hover:bg-primary/90 transition-all disabled:bg-on-surface/10 disabled:text-on-surface/50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
                      {submitting ? 'Enviando...' : (owner ? 'Solicitar Alquiler y Chatear' : 'Propietario no disponible')}
                  </button>
              </div>
          </div>
        </div>
    </div>
  );
};

export default SuitDetailPage;
