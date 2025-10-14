import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthState, AuthContextType } from '../types/artist';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

const initialAuthState: AuthState = { user: null, isAuthenticated: false, isLoading: true, error: null };

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_FAILURE'; payload: string }
    | { type: 'AUTH_LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START': return { ...state, isLoading: true, error: null };
        case 'AUTH_SUCCESS': return { ...state, isLoading: false, isAuthenticated: true, user: action.payload, error: null };
        case 'AUTH_FAILURE': return { ...state, isLoading: false, error: action.payload };
        case 'AUTH_LOGOUT': return { ...initialAuthState, isLoading: false };
        default: return state;
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authState, dispatch] = useReducer(authReducer, initialAuthState);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const user = session?.user;
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('display_name, avatar_url').eq('id', user.id).single();

                const appUser: User = {
                    id: user.id,
                    displayName: profile?.display_name || 'New User',
                    email: user.email || '',
                    avatar: profile?.avatar_url,
                    role: 'viewer', joinedDate: new Date(user.created_at || ''), isVerified: true,
                };
                dispatch({ type: 'AUTH_SUCCESS', payload: appUser });
            } else {
                dispatch({ type: 'AUTH_LOGOUT' });
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const register = async (userData: RegisterData) => {
        // ... register logic ...
    };

    const login = async (credentials: LoginCredentials) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const { error } = await supabase.auth.signInWithPassword(credentials);
            if (error) {
                throw new Error(error.message);
            }
            // The onAuthStateChange listener will handle the success case
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE', payload: error.message });
        }
    };

    const logout = async () => { await supabase.auth.signOut(); };
    const clearError = () => {};

    const value = { authState, register, login, logout, clearError };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};