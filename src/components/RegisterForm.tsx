import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Icon } from './IconSystem';

interface RegisterFormProps {
    onSwitchToLogin: () => void;
    onClose: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onClose }) => {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'artist' as 'artist' | 'viewer'
    });
    const { register, authState, clearError } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (authState.error) {
            clearError();
        }
    };

    const passwordsMatch = formData.password === formData.confirmPassword;
    const isFormValid = formData.displayName && formData.email && formData.password && passwordsMatch;

    return (
        <div className="modal-content">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Join ArtVibe</h2>
                <button
                    onClick={onClose}
                    className="btn-text"
                >
                    <Icon name="x" size="sm" />
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">
                        <Icon name="user" size="sm" className="muted" />
                        Display Name *
                    </label>
                    <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        required
                        placeholder="How should we call you?"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <Icon name="mail" size="sm" className="muted" />
                        Email *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <Icon name="briefcase" size="sm" className="muted" />
                        I am a... *
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="form-input"
                    >
                        <option value="artist">🎨 Artist (I want to showcase my work)</option>
                        <option value="viewer">👁️ Viewer (I want to discover artists)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <Icon name="lock" size="sm" className="muted" />
                        Password *
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Create a password"
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <Icon name="lock" size="sm" className="muted" />
                        Confirm Password *
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Confirm your password"
                        className="form-input"
                    />
                    {formData.confirmPassword && !passwordsMatch && (
                        <p style={{
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            margin: '0.5rem 0 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Icon name="x-circle" size="xs" />
                            Passwords do not match
                        </p>
                    )}
                </div>

                {authState.error && (
                    <div style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Icon name="x-circle" size="sm" />
                        {authState.error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={authState.isLoading || !isFormValid}
                    className="btn-primary"
                    style={{ width: '100%', marginBottom: '1rem' }}
                >
                    {authState.isLoading ? (
                        <>
                            <Icon name="refresh" size="sm" className="spin" />
                            Creating Account...
                        </>
                    ) : (
                        <>
                            <Icon name="user-plus" size="sm" />
                            Create Account
                        </>
                    )}
                </button>
            </form>

            <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="btn-text"
                        style={{ padding: 0 }}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;