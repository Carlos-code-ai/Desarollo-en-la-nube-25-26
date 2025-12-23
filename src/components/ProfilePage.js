import React from 'react';
import useAuth from '../hooks/useAuth.js';

// --- Iconos para las opciones del menú ---
const SuitcaseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const HeartIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const CogIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0h1.5m15 0h-1.5m-15 0l-.375-.375M21 12l-.375-.375m-17.25 0l-.375.375M3.375 12l.375.375m16.5 0l.375-.375M4.5 19.5l-1.5-1.5M19.5 4.5l-1.5-1.5" /></svg>;
const ChevronRightIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;
const CalendarDaysIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>


const ProfilePage = ({ onNavClick }) => {
  const { user } = useAuth();

  const ratings = { owner: 4.8, renter: 5.0 };

  if (!user) {
    return <div>Cargando perfil...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-6 pb-8">
      
      <div className="flex flex-col items-center space-y-4 p-6 bg-surface-container rounded-3xl shadow-sm">
        <img 
          src={user.photoURL}
          alt="Foto de perfil" 
          className="h-24 w-24 rounded-full object-cover border-4 border-primary"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-on-surface">{user.displayName}</h1>
          <p className="text-on-surface-variant">{user.email}</p>
        </div>
        <button className="mt-2 text-sm font-semibold text-primary hover:underline">
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-surface-container p-4 rounded-xl">
          <p className="text-sm text-on-surface-variant">Puntuación como Dueño</p>
          <p className="text-2xl font-bold text-on-surface">⭐ {ratings.owner.toFixed(1)}</p>
        </div>
        <div className="bg-surface-container p-4 rounded-xl">
          <p className="text-sm text-on-surface-variant">Puntuación como Inquilino</p>
          <p className="text-2xl font-bold text-on-surface">⭐ {ratings.renter.toFixed(1)}</p>
        </div>
      </div>

      <div className="bg-surface-container rounded-xl overflow-hidden">
        <ul className="divide-y divide-outline/50">
          <li onClick={() => onNavClick('my-items')} className="flex items-center justify-between p-4 hover:bg-surface-container-high cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <SuitcaseIcon className="h-6 w-6 text-on-surface-variant" />
              <span className="font-medium text-on-surface">Mis Artículos</span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-on-surface-variant" />
          </li>

          <li onClick={() => onNavClick('my-rentals')} className="flex items-center justify-between p-4 hover:bg-surface-container-high cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <CalendarDaysIcon className="h-6 w-6 text-on-surface-variant" />
              <span className="font-medium text-on-surface">Mis Alquileres</span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-on-surface-variant" />
          </li>

          <li onClick={() => onNavClick('my-favorites')} className="flex items-center justify-between p-4 hover:bg-surface-container-high cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <HeartIcon className="h-6 w-6 text-on-surface-variant" />
              <span className="font-medium text-on-surface">Favoritos</span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-on-surface-variant" />
          </li>

          <li className="flex items-center justify-between p-4 hover:bg-surface-container-high cursor-pointer transition-colors">
            <div className="flex items-center space-x-4">
              <CogIcon className="h-6 w-6 text-on-surface-variant" />
              <span className="font-medium text-on-surface">Ajustes</span>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-on-surface-variant" />
          </li>
        </ul>
      </div>

    </div>
  );
};

export default ProfilePage;
