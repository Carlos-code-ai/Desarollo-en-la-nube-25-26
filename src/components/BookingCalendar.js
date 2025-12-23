
import React, { useState, useEffect, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { collection, getDocs, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.js';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth.js';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const BookingCalendar = ({ suitId }) => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState(undefined);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const bookingButtonRef = useRef(null); // Ref para el botón

  // Animación de éxito del botón
  useGSAP(() => {
    // Definimos la animación pero no la ejecutamos aún
    const timeline = gsap.timeline({ paused: true, defaults: { duration: 0.3 } })
      .to(bookingButtonRef.current, { backgroundColor: '#16a34a', ease: 'power2.in' })
      .to(bookingButtonRef.current, { textContent: '¡Reservado!', duration: 0, delay: -0.1 })
      .to(bookingButtonRef.current, { scale: 1.05, yoyo: true, repeat: 1, ease: 'power2.out' })
      .to(bookingButtonRef.current, { backgroundColor: '#2563eb', textContent: 'Confirmar Reserva', delay: 1.5, ease: 'power2.inOut' }, '>');
      
      // Guardamos la animación en el elemento para poder acceder a ella más tarde
      gsap.data(bookingButtonRef.current, "timeline", timeline);

  }, { scope: bookingButtonRef });

  const playSuccessAnimation = () => {
    // Accedemos a la animación guardada y la reproducimos
    const timeline = gsap.data(bookingButtonRef.current, "timeline");
    if (timeline) timeline.play(0);
  }

  useEffect(() => { 
    const fetchBookings = async () => {
        if (!suitId) return;
        try {
            setLoading(true);
            const bookingsColRef = collection(db, `suits/${suitId}/reservations`);
            const querySnapshot = await getDocs(bookingsColRef);
            const dates = [];
            querySnapshot.forEach(doc => {
                const { startDate, endDate } = doc.data();
                if (startDate && endDate) {
                    let currentDate = startDate.toDate();
                    const finalDate = endDate.toDate();
                    while (currentDate <= finalDate) {
                        dates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
            });
            setBookedDates(dates);
        } catch (error) {
            console.error("Error fetching bookings: ", error);
        } finally {
            setLoading(false);
        }
    };

    fetchBookings();
  }, [suitId]);

  const handleBooking = async () => {
    if (!user) { alert('Por favor, inicia sesión para reservar.'); return; }
    if (!dateRange?.from || !dateRange?.to) { alert('Por favor, selecciona un rango de fechas válido.'); return; }

    setIsBooking(true);
    try {
      const bookingsColRef = collection(db, `suits/${suitId}/reservations`);
      await addDoc(bookingsColRef, {
        userId: user.uid,
        userEmail: user.email,
        startDate: Timestamp.fromDate(dateRange.from),
        endDate: Timestamp.fromDate(dateRange.to),
        createdAt: serverTimestamp()
      });

      const newBookedDates = [];
      let currentDate = new Date(dateRange.from);
      const finalDate = new Date(dateRange.to);
      while (currentDate <= finalDate) {
        newBookedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setBookedDates(prevDates => [...prevDates, ...newBookedDates]);
      setDateRange(undefined);
      
      playSuccessAnimation();

    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert('Hubo un problema al crear tu reserva. Por favor, inténtalo de nuevo.');
    } finally {
      setIsBooking(false);
    }
  };

  const footer = dateRange?.from ? (
    dateRange.to ?
      <p>Fechas seleccionadas: {format(dateRange.from, "PPP")} a {format(dateRange.to, "PPP")}</p> :
      <p>Selecciona el día de fin.</p>
  ) : (
    <p>Selecciona el primer día de tu reserva.</p>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4">Reserva tu fecha</h3>
      <DayPicker
        mode="range"
        selected={dateRange}
        onSelect={setDateRange}
        disabled={[{ before: new Date() }, ...bookedDates]}
        modifiers={{ booked: bookedDates }}
        modifiersClassNames={{ booked: 'rdp-day_booked' }}
        className="w-full flex justify-center"
        footer={<div className="text-center mt-4 text-sm text-neutral-600">{footer}</div>}
      />
      <button 
        ref={bookingButtonRef}
        onClick={handleBooking}
        disabled={!dateRange?.to || !user || isBooking || loading}
        className="mt-4 w-full rounded-full bg-blue-600 py-3 text-white font-bold shadow-lg transition-colors duration-300 ease-in-out hover:bg-blue-700 disabled:bg-neutral-400 disabled:shadow-none disabled:cursor-not-allowed active:scale-95"
      >
        {isBooking ? 'Procesando Reserva...' : (user ? 'Confirmar Reserva' : 'Inicia Sesión para Reservar')}
      </button>
    </div>
  );
};

export default BookingCalendar; 
