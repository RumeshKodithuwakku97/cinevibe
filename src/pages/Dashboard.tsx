import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Post } from '../types/artist'; // Assuming you'll show user's posts
import { Icon } from '../components/IconSystem';

const Dashboard: React.FC = () => {
    const { authState } = useAuth();

    if (!authState.isAuthenticated || !authState.user) {
        return (
            <div className="dashboard-container">
                <div className="empty-state">
                    <h3>Please Log In</h3>
                    <p>You need to be logged in to view your dashboard.</p>
                </div>
            </div>
        );
    }

    const { user } = authState;
    // In a real app, you would fetch the user's posts
    const userPosts: Post[] = [];

    return (
        <div className="dashboard-container fade-in">
            <header className="dashboard-header">
                <div className="post-avatar" style={{width: 100, height: 100, fontSize: '3rem', margin: '0 auto 1rem'}}>
                    {user.displayName.charAt(0)}
                </div>
                <h1>{user.displayName}</h1>
                <p className="text-secondary">{user.email}</p>
            </header>

            <section>
                <h2 style={{marginBottom: '1.5rem'}}>Your Posts</h2>
                {userPosts.length === 0 ? (
                    <div className="empty-state">
                        <div className="icon"><Icon name="file-text" size="2xl" /></div>
                        <h3>You haven't posted anything yet.</h3>
                        <p>Create your first post on the Feed page to see it here.</p>
                    </div>
                ) : (
                    <div>{/* Map over and display user posts here */}</div>
                )}
            </section>
        </div>
    );
};

export default Dashboard;