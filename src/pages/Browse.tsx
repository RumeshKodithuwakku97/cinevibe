import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Artist, ArtistType, Skill, PortfolioItem, ContactInfo } from '../types/artist';
import { UserCard } from '../components/UserCard';
import { Icon } from '../components/IconSystem';

const sampleUsers: Artist[] = [
    {
        id: '1', name: 'sarah-chen', displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        artistType: ['painting', 'digital-art'], bio: 'Mixed media artist.',
        skills: [], portfolio: [],
        contact: { email: 's.chen@art.com', location: 'NY', availableForWork: true, availableForCollaboration: true },
        joinedDate: new Date(), vibeTags: []
    },
    {
        id: '2', name: 'marcus-rodriguez', displayName: 'Marcus Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        artistType: ['film', 'photography'], bio: 'Cinematographer and filmmaker.',
        skills: [], portfolio: [],
        contact: { email: 'm.rod@films.com', location: 'LA', availableForWork: false, availableForCollaboration: true },
        joinedDate: new Date(), vibeTags: []
    }
];

const Browse: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = sampleUsers.filter(user => user.displayName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="page-container">
            <div className="page-header"><h1>Meet the Community</h1></div>
            <div className="search-box" style={{maxWidth: '600px', margin: '0 auto 2.5rem auto'}}>
                <Icon name="search" size="md" className="search-icon" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input"/>
            </div>
            <div className="community-grid">
                {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} onViewProfile={() => navigate(`/profile/${user.id}`)} />
                ))}
            </div>
        </div>
    );
};
export default Browse;