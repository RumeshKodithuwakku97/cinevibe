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
                    // Try to fetch custom profile data
                    const { data: profileData, error: profileError } = await supabase.from('profiles').select('display_name, avatar_url, role').eq('id', user.id).single();
                    profile = profileData;
                    if (profileError && profileError.code !== 'PGRST116') {
                        console.error('Error fetching profile:', profileError.message);
                    }
                } catch (e) {
                    console.error('Error during profile fetch in onAuthStateChange:', e);
                }

                // Construct app user with fallback values
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
            // 1. Supabase Auth Signup (Creates user in auth.users)
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

            // 2. Create corresponding user profile in the 'profiles' table
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            display_name: displayName,
                            role: role,
                            email: email // Store email as well
                            // Add all other non-nullable columns your profiles table expects
                        }
                    ]);

                if (profileError) {
                    // Log the error but continue, as the core user account is created.
                    console.error('Error creating user profile in "profiles" table:', profileError);
                }
            }

            // Return user object on success
            return data.user;
        } catch (error: any) {
            dispatch({ type: 'AUTH_FAILURE', payload: error.message });
            return null;
        }
    };

    const login = async (credentials: LoginCredentials) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const { error } = await supabase.auth.signInWithPassword(credentials);
            if (error) {
                throw new Error(error.message);
            }
            // The onAuthStateChange listener handles the successful authentication flow
        } catch (error: any) {
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