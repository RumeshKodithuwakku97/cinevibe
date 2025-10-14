import React from 'react';

// --- Core User Type ---
export interface User {
    _id?: string; // For MongoDB or similar database compatibility
    id: string;
    email: string;
    displayName: string;
    avatar?: string;
    role: 'artist' | 'viewer' | 'admin';
    joinedDate: Date;
    isVerified: boolean;
}

// --- Authentication Types ---
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    displayName: string;
    email: string;
    password: string;
    confirmPassword?: string; // Optional for contexts that don't need it
    role?: 'artist' | 'viewer';
}

export interface AuthContextType {
    authState: AuthState;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}


// --- Movie, Discussion, and Social Feed Types ---

export interface Movie {
    id: string;
    title: string;
    releaseYear: number;
    director: string;
    genre: string[];
    posterUrl: string;
    backdropUrl: string;
    summary: string;
    rating: number;
}

export interface DiscussionMessage {
    id: string;
    sender: User;
    content: string;
    timestamp: Date;
}

export interface Discussion {
    id: string;
    title: string;
    author: User;
    excerpt: string;
    participants: User[];
    messages: DiscussionMessage[];
    createdAt: Date;
}

export type PostType =
    | 'movie_discussion'
    | 'movie_review'
    | 'question'
    | 'inspiration'
    | 'work_in_progress'
    | 'finished_piece'
    | 'announcement';

export interface Comment {
    id: string;
    author: User;
    content: string;
    createdAt: Date;
    likes: string[];
    replies: Comment[];
}

export interface Post {
    _id?: string;
    id: string;
    author: User;
    type: PostType;
    content: string;
    tags: string[];
    likes: string[];
    comments: Comment[];
    shares: number;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    allowComments: boolean;
    artistTypes: ArtistType[];
}

export interface CreatePostData {
    content: string;
    type: PostType;
    tags: string[];
    isPublic: boolean;
    allowComments: boolean;
    artistTypes: ArtistType[];
}


// --- Profile-Specific & Legacy Types ---

export type ArtistType =
    | 'film'
    | 'painting'
    | 'music'
    | 'digital-art'
    | 'photography'
    | 'dance'
    | 'performance'
    | 'sculpture'
    | 'theater'
    | 'writing';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
    name: string;
    level: SkillLevel;
    yearsOfExperience: number;
}

export interface PortfolioItem {
    id: string;
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    title: string;
    description?: string;
    tags: string[];
    createdAt: Date;
    featured: boolean;
}

export interface ContactInfo {
    email: string;
    location?: string;
    availableForWork: boolean;
    availableForCollaboration: boolean;
}

export interface Artist {
    id: string;
    name: string;
    displayName: string;
    avatar?: string;
    coverImage?: string;
    artistType: ArtistType[];
    bio: string;
    skills: Skill[];
    portfolio: PortfolioItem[];
    contact: ContactInfo;
    joinedDate: Date;
    vibeTags: string[];
    stats?: {
        posts: number;
        followers: number;
        following: number;
    };
}

export interface PortfolioFormData {
    title: string;
    description: string;
    tags: string[];
    type: PortfolioItem['type'];
    featured: boolean;
}

export type CollaborationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export type CollaborationType = 'project' | 'commission' | 'partnership' | 'event' | 'other';

export interface CollaborationMessage {
    id: string;
    sender: User;
    content: string;
    timestamp: Date;
    readBy: string[];
}

export interface Collaboration {
    id: string;
    title: string;
    description: string;
    type: CollaborationType;
    status: CollaborationStatus;
    initiator: User;
    artists: User[];
    skillsNeeded: string[];
    messages: CollaborationMessage[];
}


// --- Component Prop Types ---

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}