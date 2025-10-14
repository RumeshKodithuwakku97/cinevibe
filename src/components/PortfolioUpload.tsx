import React, { useState } from 'react';
import { PortfolioItem } from '../types/artist';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// **FIXED**: Added 'userId' to the props interface
interface PortfolioUploadProps {
    userId: string;
    onUploadComplete: (portfolioItem: PortfolioItem) => void;
    onClose: () => void;
}

const PortfolioUpload: React.FC<PortfolioUploadProps> = ({ userId, onUploadComplete, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async () => {
        if (!title.trim()) return;

        // Save the new portfolio item to a sub-collection in Firestore
        const portfolioCollectionRef = collection(db, "profiles", userId, "portfolio");
        const docRef = await addDoc(portfolioCollectionRef, {
            title,
            description,
            type: 'image', // Default type for now
            createdAt: serverTimestamp(),
            featured: false,
        });

        const newItem: PortfolioItem = {
            id: docRef.id,
            title,
            description,
            tags: [],
            type: 'image',
            url: '', // This would come from file storage in a real app
            createdAt: new Date(),
            featured: false,
        };
        onUploadComplete(newItem);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add to Portfolio</h2>
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleSubmit} className="btn btn-primary">Add Item</button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioUpload;