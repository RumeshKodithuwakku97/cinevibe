import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Header';
import './App.css';

// Lazy load all page components for faster initial load times
const Home = lazy(() => import('./pages/Home'));
// @ts-ignore
const Feed = lazy(() => import('./pages/Feed'));
const Movies = lazy(() => import('./pages/Movies'));
const Browse = lazy(() => import('./pages/Browse'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// A simple loading spinner component for Suspense fallback
const LoadingSpinner: React.FC = () => (
    <div className="loading-state">
        <div className="spinner"></div>
    </div>
);

const App: React.FC = () => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <Router>
                    <div className="App">
                        <Header />
                        <main>
                            <Suspense fallback={<LoadingSpinner />}>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/feed" element={<Feed />} />
                                    <Route path="/movies" element={<Movies />} />
                                    <Route path="/browse" element={<Browse />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/profile/:id" element={<UserProfile />} />

                                    {/* Legacy route, can be removed or redirected if no longer needed */}
                                    <Route path="/collaborations" element={<div className="page-container">Redirecting...</div>} />
                                </Routes>
                            </Suspense>
                        </main>
                    </div>
                </Router>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;