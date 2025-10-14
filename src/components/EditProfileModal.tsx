import React, { useState } from 'react';
import { Artist } from '../types/artist';
import { supabase } from '../supabaseClient';
import { Icon } from './IconSystem';

interface EditProfileModalProps {
    userProfile: Artist;
    onClose: () => void;
    onSave: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ userProfile, onClose, onSave }) => {
    const [bio, setBio] = useState(userProfile.bio);
    const [displayName, setDisplayName] = useState(userProfile.displayName);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (file: File, imageType: 'avatar' | 'cover') => {
        if (!file) return;
        setIsUploading(true);
        const bucket = `${imageType}s`; // 'avatars' or 'covers'
        const filePath = `${userProfile.id}/${Date.now()}`;

        try {
            const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            const updateField = imageType === 'avatar' ? 'avatar_url' : 'cover_image_url';
            const { error: updateError } = await supabase.from('profiles').update({ [updateField]: publicUrl }).eq('id', userProfile.id);
            if (updateError) throw updateError;

            onSave();
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveChanges = async () => {
        const { error } = await supabase.from('profiles').update({ bio, display_name: displayName }).eq('id', userProfile.id);
        if (error) console.error(error);
        else {
            onSave();
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Profile</h2>
                <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <input className="form-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Bio / Intro</label>
                    <textarea className="form-textarea" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Profile Picture</label>
                    <input type="file" className="form-input" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'avatar')} disabled={isUploading} />
                </div>
                <div className="form-group">
                    <label className="form-label">Cover Image</label>
                    <input type="file" className="form-input" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], 'cover')} disabled={isUploading} />
                </div>
                {isUploading && <p>Uploading image...</p>}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleSaveChanges} className="btn btn-primary" disabled={isUploading}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};