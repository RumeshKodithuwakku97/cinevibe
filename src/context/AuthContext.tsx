import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthState, AuthContextType } from '../types/artist';
import { supabase } from '../supabaseClient';
import { Session } from '@supabase/supabase-js';

const initialAuthState: AuthState = { user: null, isAuthenticated: false, isLoading: true, error: null };

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_FAILURE'; payload: string | null }
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
                let profile;
                try {
                    const { data: profileData, error: profileError } = await supabase.from('profiles').select('display_name, avatar_url, role').eq('id', user.id).single();
                    profile = profileData;
                    if (profileError && profileError.code !== 'PGRST116') {
                        console.error('Error fetching profile:', profileError.message);
                    }
                } catch (e) {
                    console.error('Error during profile fetch in onAuthStateChange:', e);
                }

                const appUser: User = {
                    id: user.id,
                    displayName: profile?.display_name || (user.user_metadata.display_name as string) || user.email?.split('@')[0] || 'New User',
                    email: user.email || '',
                    avatar: profile?.avatar_url || (user.user_metadata.avatar_url as string) || null,
                    role: (profile?.role || user.user_metadata.role || 'viewer') as 'artist' | 'viewer',
                    joinedDate: new Date(user.created_at || ''),
                    isVerified: !!user.email_confirmed_at,
                };
                dispatch({ type: 'AUTH_SUCCESS', payload: appUser });
            } else {
                dispatch({ type: 'AUTH_LOGOUT' });
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const register = async (userData: RegisterData) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const { email, password, displayName, role } = userData;
            // Supabase signup logic: Create the user and optionally include metadata
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName,
                        role: role
                    }
                }
            });

            if (error) {
                throw new Error(error.message);
            }

            return data.user;
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE', payload: error.message });
            return null;
        }
    };

    const login = async (credentials: LoginCredentials) => {
        dispatch({ type: 'AUTH_START' });
        try {
            // This is the core login call
            const { error } = await supabase.auth.signInWithPassword(credentials);
            if (error) {
                // If supabase returns an error, throw it to be caught below
                throw new Error(error.message);
            }
            // If sign-in succeeds, the onAuthStateChange listener will automatically handle AUTH_SUCCESS
            // by fetching the profile and updating the state.
        } catch (error: any) {
            // Handle the error by dispatching AUTH_FAILURE
            dispatch({ type: 'AUTH_FAILURE', payload: error.message });
        }
    };

    const logout = async () => { await supabase.auth.signOut(); };

    const clearError = () => {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
    };

    // @ts-ignore
    const value: AuthContextType = { authState, register, login, logout, clearError };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};