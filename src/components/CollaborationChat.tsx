import React, { useState, useRef, useEffect } from 'react';
import { Collaboration, CollaborationMessage, User } from '../types/artist';
import { Icon } from './IconSystem';

interface CollaborationChatProps {
    collaboration: Collaboration;
    currentUser: User;
    onSendMessage: (content: string) => void;
    onClose: () => void;
}

const CollaborationChat: React.FC<CollaborationChatProps> = ({
                                                                 collaboration,
                                                                 currentUser,
                                                                 onSendMessage,
                                                                 onClose
                                                             }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [collaboration.messages]);

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
                    <h3>{collaboration.title}</h3>
                    <button onClick={onClose} className="btn-icon"><Icon name="x" size="md" /></button>
                </div>
                <div className="chat-messages">
                    {/* CORRECTED: Explicitly typed the 'message' parameter */}
                    {collaboration.messages.map((message: CollaborationMessage) => (
                        <div key={message.id} className={`chat-message ${message.sender.id === currentUser.id ? 'sent' : 'received'}`}>
                            <div className="message-bubble">
                                {message.sender.id !== currentUser.id && <div className="message-sender">{message.sender.displayName}</div>}
                                {message.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-area">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={handleSend} className="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    );
};

export default CollaborationChat;