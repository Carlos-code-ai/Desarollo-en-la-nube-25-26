
import React from 'react';
import { Link } from 'react-router-dom';
import LogoutIcon from './LogoutIcon';
import { gsap } from 'gsap'; // Importa gsap

const AdminHeader = () => {
    return (
        <header className="bg-primary text-on-primary p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    Ready2Wear
                </Link>
                <LogoutIcon />
            </div>
        </header>
    );
};

export default AdminHeader;
