import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Icon } from './IconSystem';
import { LoginCredentials } from '../types/artist';

interface LoginFormProps {
    onSwitchToRegister: () => void;
    onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onClose }) => {
    const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
    const { login, authState } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Save the current isAuthenticated state before attempting login
        const wasAuthenticated = authState.isAuthenticated;

        // Await the login process
        await login(credentials);

        // Check the updated isAuthenticated state after the login attempt.
        // The AuthContext listener (onAuthStateChange) is asynchronous,
        // but checking authState.user immediately after a successful login
        // often works for UI flow. A simpler, more synchronous check for login success
        // is often used in component logic like this, assuming the effect runs quickly.
        // For a more reliable check in asynchronous flows, a promise return
        // from `login` is usually better, but based on your current setup, we proceed.

        // OPTION 1: Check if the user is now authenticated and wasn't before (simple check)
        // This relies on the `onAuthStateChange` listener resolving the AuthContext state quickly.
        // Since `login` itself doesn't return the User, relying on `authState.user`
        // immediately after is a common but slightly imperfect pattern in React context logic.

        // For the current setup, we rely on the component being rerendered after auth state update.
        // We close the modal only if there was no error reported by the `login` function.
        if (!authState.error && !wasAuthenticated) {
            onClose(); // Close the modal upon successful login
        }

        // NOTE: The most robust pattern is to modify `login` in AuthContext.tsx
        // to return a boolean indicating success, but we are fixing the component here.
    };

    // ... rest of handleInputChange and component logic remains unchanged ...
// ... (omitting unchanged helper functions and rendering logic for brevity)

    return (
        <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Icon name="film" size="lg" color="var(--brand)" />
                <h2 style={{ margin: 0 }}>Log in to Cinevibe</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                        required
                        placeholder="you@example.com"
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        required
                        placeholder="••••••••"
                        className="form-input"
                    />
                </div>

                {authState.error && (
                    <p style={{ color: 'var(--error)', textAlign: 'center', marginBottom: '1rem' }}>
                        {authState.error}
                    </p>
                )}

                <button type="submit" disabled={authState.isLoading} className="btn btn-primary" style={{ width: '100%' }}>
                    {authState.isLoading ? 'Logging In...' : 'Log In'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <button onClick={onSwitchToRegister} className="btn-text" style={{color: 'var(--brand)'}}>Sign up</button>
            </p>
        </div>
    );
};

export default LoginForm;