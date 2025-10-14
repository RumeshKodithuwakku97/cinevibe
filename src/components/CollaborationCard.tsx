import React from 'react';
// @ts-ignore
import { Collaboration, CollaborationStatus } from '../types/artist';

interface CollaborationCardProps {
    collaboration: Collaboration;
    onClick: () => void;
    currentUserId: string;
}

const CollaborationCard: React.FC<CollaborationCardProps> = ({ collaboration, onClick, currentUserId }) => {
    const getStatusColor = (status: CollaborationStatus): string => {
        const colors: Record<CollaborationStatus, string> = {
            'pending': '#f59e0b', 'accepted': '#10b981', 'rejected': '#ef4444',
            'completed': '#6b7280', 'cancelled': '#ef4444'
        };
        return colors[status];
    };

    return (
        <div onClick={onClick} className="card">
            <h3>{collaboration.title}</h3>
            <p style={{ color: getStatusColor(collaboration.status) }}>{collaboration.status}</p>
        </div>
    );
};
export default CollaborationCard;