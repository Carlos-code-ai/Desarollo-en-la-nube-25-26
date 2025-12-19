import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import useAuth from './hooks/useAuth.js';
import { auth } from './firebase.js';

// Import your page components
import SuitCatalog from './pages/SuitCatalog.js';
import AddSuitPage from './pages/AddSuitPage.js';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import AboutPage from './pages/AboutPage.js';
import ContactPage from './pages/ContactPage.js';

function App() {
    const { user, loading } = useAuth();

    const handleLogout = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <header className="w3-container w3-xlarge w3-padding-24">
                <a href="/" className="w3-bar-item w3-button w3-left">READY2WEAR</a>
                <div className="w3-right">
                    <Link to="/catalog" className="w3-bar-item w3-button">Catalog</Link>
                    <Link to="/about" className="w3-bar-item w3-button">About</Link>
                    <Link to="/contact" className="w3-bar-item w3-button">Contact</Link>
                    <Link to="/add-suit" className="w3-bar-item w3-button">Add Suit</Link>
                    {user ? (
                        <>
                            <button onClick={handleLogout} className="w3-bar-item w3-button">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="w3-bar-item w3-button">Login</Link>
                            <Link to="/signup" className="w3-bar-item w3-button">Sign Up</Link>
                        </>
                    )}
                </div>
            </header>

            <div className="w3-main" style={{ marginLeft: '250px', marginRight: '250px' }}>
                <Routes>
                    <Route path="/" element={<SuitCatalog />} />
                    <Route path="/catalog" element={<SuitCatalog />} />
                    <Route path="/add-suit" element={<AddSuitPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
            </div>

            <footer className="w3-container w3-padding-16">
                <p>Powered by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank" rel="noopener noreferrer">w3.css</a></p>
            </footer>
        </Router>
    );
}

export default App;
