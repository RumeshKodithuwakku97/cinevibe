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
        await login(credentials);
    };

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