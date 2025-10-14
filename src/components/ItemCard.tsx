import React from 'react';

interface ItemCardProps {
    item: {
        id: string;
        title: string;
        imageUrl?: string;
        type: 'user' | 'movie' | 'discussion';
    };
    onClick: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
    return (
        <div className="item-card" onClick={onClick}>
            <div
                className="item-card-image"
                style={{ backgroundImage: `url(${item.imageUrl || 'https://via.placeholder.com/250'})` }}
            />
            <div className="item-card-title">{item.title}</div>
        </div>
    );
};