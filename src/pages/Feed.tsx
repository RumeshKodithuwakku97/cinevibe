import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Post, CreatePostData } from '../types/artist';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { Icon } from '../components/IconSystem';
import { supabase } from '../supabaseClient';

const Feed: React.FC = () => {
    const { authState } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`*, author:profiles(displayName, avatar_url)`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setPosts(data as any[]);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = (postData: CreatePostData) => {
        if (!authState.user) return;

        // **FIXED**: Added all missing properties to the new post object
        const newPost: Post = {
            id: `temp-${Date.now()}`,
            author: authState.user,
            content: postData.content,
            type: postData.type,
            likes: [],
            comments: [],
            shares: 0,
            createdAt: new Date(),
            // --- MISSING PROPERTIES ADDED ---
            updatedAt: new Date(),
            tags: [],
            isPublic: true,
            allowComments: true,
            artistTypes: [],
        };

        // This is a UI-only update for now. The backend logic would handle the database insert.
        setPosts(prev => [newPost, ...prev]);
        setShowCreatePost(false);
    };

    const handleLike = (postId: string) => {
        // Placeholder for like functionality
    };

    if (isLoading) {
        return <div className="loading-state"><div className="spinner"></div><p>Loading Feed...</p></div>;
    }

    return (
        <div className="page-container" style={{ maxWidth: '720px' }}>
            {authState.isAuthenticated && (
                <div className="create-post-trigger" onClick={() => setShowCreatePost(true)}>
                    <div className="post-avatar">{authState.user?.displayName.charAt(0)}</div>
                    <div className="trigger-text">What's on your mind?</div>
                    <button className="btn btn-primary"><Icon name="plus" size="sm" /> Create</button>
                </div>
            )}

            {posts.length === 0 ? (
                <div className="empty-state">
                    <h3>The Feed is Quiet</h3>
                    <p>Be the first to create a post!</p>
                </div>
            ) : (
                posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                    />
                ))
            )}

            {showCreatePost && (
                <CreatePost
                    onPostCreated={handlePostCreated}
                    onClose={() => setShowCreatePost(false)}
                />
            )}
        </div>
    );
};

export default Feed;