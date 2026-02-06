
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../hooks/useAuth.js';

const FloatingLabelInput = ({ label, type = 'text', value, onChange }) => (
    <div className="relative w-full">
        <input
            type={type}
            id={label}
            value={value}
            onChange={onChange}
            className="block w-full px-4 py-3 bg-white/10 rounded-lg border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all peer"
            placeholder={label}
        />
        <label
            htmlFor={label}
            className="absolute left-4 top-3 text-white/70 transition-all duration-300 pointer-events-none
                       peer-placeholder-shown:text-base peer-placeholder-shown:top-3
                       peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary
                       -top-2.5 text-xs"
        >
            {label}
        </label>
    </div>
);

const RegisterScreen = () => {
    const { registerWithEmail } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const buttonRef = useRef(null);

    const handleRegister = async () => {
        gsap.fromTo(buttonRef.current, { scale: 1 }, { scale: 1.05, yoyo: true, repeat: 1, duration: 0.1, ease: 'power1.inOut' });

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setError('');

        try {
            await registerWithEmail(email, password);
            navigate('/'); // Redirect to home on successful registration
        } catch (error) {
            console.error("Error al registrar:", error);
            setError('Error al registrar. Es posible que el correo ya esté en uso.');
        }
    };

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-background'>
            <div className="w-full max-w-md p-8 md:p-12 space-y-8 rounded-2xl bg-surface backdrop-blur-xl border border-white/10 shadow-2xl text-on-surface">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tighter">Crear Cuenta</h1>
                    <p className="text-on-surface/70 mt-2">Únete a Ready2Wear</p>
                </div>

                <div className="space-y-6">
                    <FloatingLabelInput label="Correo Electrónico" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FloatingLabelInput label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FloatingLabelInput label="Confirmar Contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                <div className="space-y-4">
                    <button
                        ref={buttonRef}
                        onClick={handleRegister}
                        className='w-full bg-primary text-on-primary font-bold py-3 px-6 rounded-full transition-transform hover:scale-105 active:scale-100 shadow-lg'
                    >
                        Registrarse
                    </button>

                    <p className="text-center text-xs text-on-surface/50">
                        ¿Ya tienes una cuenta? <a href="/login" className="font-semibold text-primary hover:underline">Inicia Sesión</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
