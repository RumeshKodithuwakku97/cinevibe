import React from 'react';
// Make sure 'User' is included in the import from your types file
import { Post, User } from '../types/artist';
import { useAuth } from '../context/AuthContext';
import { Icon } from './IconSystem';

// ... rest of the component code

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
    const { authState } = useAuth();
    const isLiked = authState.user ? post.likes.includes(authState.user.id) : false;

    const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    return (
        <div className="post-card">
            <header className="post-header">
                <div className="post-avatar">{post.author.displayName.charAt(0)}</div>
                <div className="post-author-info">
                    <h4>{post.author.displayName}</h4>
                    <p>{timeAgo(post.createdAt)}</p>
                </div>
            </header>
            <div className="post-content">
                <p>{post.content}</p>
            </div>
            <footer className="post-footer">
                <button className={`post-action-button ${isLiked ? 'liked' : ''}`} onClick={() => onLike(post.id)}>
                    <Icon name="heart" size="sm" /> <span>{post.likes.length > 0 ? post.likes.length : ''}</span>
                </button>
                <button className="post-action-button">
                    <Icon name="message-square" size="sm" /> <span>{post.comments.length > 0 ? post.comments.length : ''}</span>
                </button>
                <button className="post-action-button">
                    <Icon name="share" size="sm" /> <span>{post.shares > 0 ? post.shares : ''}</span>
                </button>
            </footer>
        </div>
    );
};

export default PostCard;