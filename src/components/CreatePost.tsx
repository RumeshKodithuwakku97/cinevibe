import React, { useState } from 'react';
import { CreatePostData, PostType } from '../types/artist';

interface CreatePostProps {
    onPostCreated: (postData: CreatePostData) => void;
    onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onClose }) => {
    const [content, setContent] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPostCreated({
            content,
            type: 'movie_discussion', // Default
            tags: [], isPublic: true, allowComments: true, artistTypes: []
        });
    };
    return (
        <div className="modal-overlay"><form className="modal-content" onSubmit={handleSubmit}>
            <h2>Create Post</h2>
            <textarea className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
            <button type="submit" className="btn btn-primary">Post</button>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
        </form></div>
    );
};
export default CreatePost;