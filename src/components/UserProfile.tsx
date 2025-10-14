import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Artist, Post } from '../types/artist';
import { Icon } from './IconSystem';
import PostCard from './PostCard';
import { supabase } from '../supabaseClient';
import { EditProfileModal } from './EditProfileModal';

const UserProfile: React.FC = () => {
    const { authState } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [userProfile, setUserProfile] = useState<Artist | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const isOwner = authState.user?.id === id;

    const fetchProfileData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (profileError) throw profileError;
            setUserProfile(profileData as Artist);

            const { data: postsData, error: postsError } = await supabase.from('posts').select(`*, author:profiles(display_name, avatar_url)`).eq('author_id', id).order('created_at', { ascending: false });
            if (postsError) throw postsError;
            setUserPosts(postsData as Post[]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    if (isLoading) { return <div className="loading-state"><div className="spinner"></div></div>; }
    if (!userProfile) { return <div className="page-container"><div className="empty-state"><h2>User not found</h2></div></div>; }

    return (
        <>
            <div className="profile-page">
                <header className="profile-header">
                    <div className="profile-cover-image" style={{ backgroundImage: `url(${userProfile.coverImage})` }} />
                    <div className="profile-header-content">
                        <div className="profile-avatar-wrapper">
                            <img src={userProfile.avatar || 'https://via.placeholder.com/120'} alt={userProfile.displayName} className="profile-avatar" />
                        </div>
                        <div className="profile-info"><h1>{userProfile.displayName}</h1><p>{userProfile.bio}</p></div>
                        <div className="profile-actions">
                            {isOwner ? (
                                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}><Icon name="edit" size="sm" /> Edit Profile</button>
                            ) : (
                                <button className="btn btn-primary"><Icon name="user-plus" size="sm" /> Follow</button>
                            )}
                        </div>
                    </div>
                </header>
                <main className="profile-content feed-tab">
                    {userPosts.length > 0 ? (
                        userPosts.map(post => <PostCard key={post.id} post={post} onLike={() => {}} />)
                    ) : (
                        <div className="empty-state"><h3>No posts yet.</h3></div>
                    )}
                </main>
            </div>
            {isEditing && <EditProfileModal userProfile={userProfile} onClose={() => setIsEditing(false)} onSave={fetchProfileData} />}
        </>
    );
};

export default UserProfile;