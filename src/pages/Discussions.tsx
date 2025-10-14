import React, { useState } from 'react';
import { DiscussionCard } from '../components/DiscussionCard';
import { DiscussionChat } from '../components/DiscussionChat';
import { Discussion, User, DiscussionMessage } from '../types/artist';
import { useAuth } from '../context/AuthContext';

const sampleDiscussions: Discussion[] = [
    {
        id: '1',
        title: 'Is Blade Runner 2049 a worthy successor?',
        author: { id: '2', displayName: 'Marcus R.', email: '', role: 'artist', joinedDate: new Date(), isVerified: true },
        excerpt: 'Let\'s break down the cinematography, score, and philosophical themes.',
        participants: [],
        messages: [],
        createdAt: new Date(),
    },
];

const Discussions: React.FC = () => {
    const { authState } = useAuth();
    const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);

    if (!authState.user) return <div className="page-container"><p>Please log in to join the discussions.</p></div>;

    const handleSendMessage = (content: string) => {
        // In a real app, this would send the message to your backend
        console.log(`Sending message to ${selectedDiscussion?.id}: ${content}`);
    };

    return (
        <div className="page-container">
            <div className="page-header"><h1>Community Discussions</h1></div>
            <div className="discussions-grid">
                {sampleDiscussions.map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} onClick={() => setSelectedDiscussion(discussion)} />
                ))}
            </div>
            {selectedDiscussion && (
                <DiscussionChat
                    discussion={selectedDiscussion}
                    currentUser={authState.user}
                    onSendMessage={handleSendMessage}
                    onClose={() => setSelectedDiscussion(null)}
                />
            )}
        </div>
    );
};

export default Discussions;