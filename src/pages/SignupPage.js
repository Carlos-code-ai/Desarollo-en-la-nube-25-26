
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/'); // Redirect to the main page upon successful signup
        } catch (error) {
            setError('Error signing up. Please try again.');
            console.error("Signup Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default SignupPage;
