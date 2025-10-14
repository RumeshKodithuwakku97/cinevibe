import React, { useState } from 'react';
import { Artist } from '../types/artist';
import { Icon } from './IconSystem';

interface UserCardProps {
    user: Artist;
    onViewProfile: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onViewProfile }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the card's onClick from firing
        setIsFollowing(!isFollowing);
        // In a real app, you would also make an API call here
    };

    return (
        <div className="user-card" onClick={() => onViewProfile(user.id)}>
            <div className="user-card-banner" />
            <div className="user-card-avatar-wrapper">
                {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName} className="user-card-avatar" />
                ) : (
                    <div className="user-card-avatar-placeholder">{user.displayName.charAt(0)}</div>
                )}
            </div>
            <div className="user-card-info">
                <h3 className="user-card-name">{user.displayName}</h3>
                <p className="user-card-bio">
                    {user.bio.length > 80 ? `${user.bio.substring(0, 80)}...` : user.bio}
                </p>
                <div className="user-card-tags">
                    {user.artistType.slice(0, 2).map(type => (
                        <span key={type} className="user-card-tag">{type.replace('-', ' ')}</span>
                    ))}
                </div>
            </div>
            <div className="user-card-footer">
                <button
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    style={{ width: '100%' }}
                    onClick={handleFollow}
                >
                    <Icon name={isFollowing ? 'check' : 'plus'} size="sm" />
                    {isFollowing ? 'Following' : 'Follow'}
                </button>
            </div>
        </div>
    );
};