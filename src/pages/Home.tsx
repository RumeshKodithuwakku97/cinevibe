
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/IconSystem';

const VideoBackground: React.FC = () => (
    <div className="video-background">
        <video autoPlay loop muted playsInline>
            <source src="/videos/background.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div className="video-overlay" />
    </div>
);

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { authState } = useAuth();

    return (
        <div className="home-page-container">
            <VideoBackground />
            <div className="home-content">
                <header className="home-hero">
                    <h1 className="hero-title">Your Cinematic Social Universe</h1>
                    <p className="hero-subtitle">
                        Discover, discuss, and dive deep into the world of film and art. Share your voice.
                    </p>
                    <div className="hero-actions">
                        {authState.isAuthenticated ? (
                            <button className="btn btn-primary" style={{padding: '1rem 2.5rem', fontSize: '1rem'}} onClick={() => navigate('/feed')}>
                                <Icon name="home" size="sm" /> Go to Feed
                            </button>
                        ) : (
                            <button className="btn btn-primary" style={{padding: '1rem 2.5rem', fontSize: '1rem'}} onClick={() => { /* This should open your auth modal */ }}>
                                <Icon name="user-plus" size="sm" /> Join the Community
                            </button>
                        )}
                    </div>
                </header>
                <section className="home-features">
                    <div className="feature-card" onClick={() => navigate('/movies')}>
                        <Icon name="video" size="lg" />
                        <h3>Explore Movies</h3>
                        <p>Browse a vast library of classic and modern films.</p>
                    </div>
                    <div className="feature-card" onClick={() => navigate('/feed')}>
                        <Icon name="message-square" size="lg" />
                        <h3>Join Discussions</h3>
                        <p>Share your reviews and theories with the community.</p>
                    </div>
                    <div className="feature-card" onClick={() => navigate('/browse')}>
                        <Icon name="users" size="lg" />
                        <h3>Connect with Creators</h3>
                        <p>Find and follow other film and art enthusiasts.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;