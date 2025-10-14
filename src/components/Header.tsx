import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Icon } from './IconSystem';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { authState, logout } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);

    return (
        <>
            <header className="app-header">
                <div className="header-content">
                    <div className="logo" onClick={() => navigate('/')}>
                        <Icon name="film" size="lg" color="var(--brand)" />
                        CINEVIBE
                    </div>
                    <nav className="nav-primary">
                        <NavLink to="/feed" className="nav-link"><Icon name="home" size="sm" /> Feed</NavLink>
                        <NavLink to="/movies" className="nav-link"><Icon name="video" size="sm" /> Movies</NavLink>
                        <NavLink to="/browse" className="nav-link"><Icon name="users" size="sm" /> Community</NavLink>
                    </nav>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {authState.isAuthenticated ? (
                            <>
                                <button onClick={() => navigate(`/profile/${authState.user?.id}`)} className="nav-link"><Icon name="user" size="sm" /> Profile</button>
                                <button onClick={logout} className="btn btn-secondary"><Icon name="log-out" size="sm" /> Logout</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setShowAuthModal('login')} className="nav-link">Log In</button>
                                <button onClick={() => setShowAuthModal('register')} className="btn btn-primary">Join Free</button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {showAuthModal && (
                <div className="modal-overlay">
                    {showAuthModal === 'login' ? (
                        <LoginForm onSwitchToRegister={() => setShowAuthModal('register')} onClose={() => setShowAuthModal(null)} />
                    ) : (
                        // **FIXED**: Corrected 'setShowAuth-modal' to 'setShowAuthModal'
                        <RegisterForm onSwitchToLogin={() => setShowAuthModal('login')} onClose={() => setShowAuthModal(null)} />
                    )}
                </div>
            )}
        </>
    );
};

export default Header;