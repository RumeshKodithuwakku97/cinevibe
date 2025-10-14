import React from 'react';
import { Discussion } from '../types/artist';
import { Icon } from './IconSystem';

interface DiscussionCardProps {
    discussion: Discussion;
    onClick: () => void;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({ discussion, onClick }) => {
    return (
        <div className="card discussion-card" onClick={onClick}>
            <h3 className="card-title">{discussion.title}</h3>
            <p>{discussion.excerpt}</p>
            <div className="card-footer">
                <span>By {discussion.author.displayName}</span>
                <span>{discussion.participants.length} participants</span>
            </div>
        </div>
    );
};