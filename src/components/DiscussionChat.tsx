import React, { useState } from 'react';
import { Discussion, DiscussionMessage, User } from '../types/artist';
import { Icon } from './IconSystem';

interface DiscussionChatProps {
    discussion: Discussion;
    currentUser: User;
    onSendMessage: (content: string) => void;
    onClose: () => void;
}

export const DiscussionChat: React.FC<DiscussionChatProps> = ({ discussion, currentUser, onSendMessage, onClose }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="chat-modal">
                <div className="chat-header">
                    <h3>{discussion.title}</h3>
                    <button onClick={onClose} className="btn-icon"><Icon name="x" size="md" /></button>
                </div>
                <div className="chat-messages">
                    {discussion.messages.map((msg: DiscussionMessage) => (
                        <div key={msg.id} className={`chat-message ${msg.sender.id === currentUser.id ? 'sent' : 'received'}`}>
                            {msg.content}
                        </div>
                    ))}
                </div>
                <div className="chat-input-area">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
                    <button onClick={handleSend} className="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    );
};