import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Icon } from './IconSystem';

const NotificationBell: React.FC = () => {
    const { notificationState, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
    const { authState } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!authState.isAuthenticated) {
        return null;
    }

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="action-btn"
                style={{ position: 'relative' }}
            >
                <Icon name="bell" size="md" />
                {notificationState.unreadCount > 0 && (
                    <div className="notification-badge" />
                )}
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '400px',
                    maxHeight: '500px',
                    backgroundColor: 'var(--secondary-dark)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-primary)',
                    zIndex: 1000,
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid var(--border-primary)',
                        backgroundColor: 'var(--primary-dark)'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>
                            Notifications
                        </h3>
                        {notificationState.unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="btn-text"
                                style={{ fontSize: '0.8rem' }}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto'
                    }}>
                        {notificationState.notifications.length === 0 ? (
                            <div style={{
                                padding: '2rem 1.5rem',
                                textAlign: 'center',
                                color: 'var(--text-muted)'
                            }}>
                                <Icon name="bell" size="2xl" className="muted" />
                                <p style={{ margin: '0.5rem 0 0 0' }}>No notifications yet</p>
                            </div>
                        ) : (
                            notificationState.notifications.slice(0, 10).map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        setIsOpen(false);
                                        if (notification.actionUrl) {
                                            window.location.href = notification.actionUrl;
                                        }
                                    }}
                                    style={{
                                        padding: '1rem 1.5rem',
                                        borderBottom: '1px solid var(--border-primary)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        backgroundColor: notification.status === 'unread' ? 'var(--primary-dark)' : 'transparent',
                                        position: 'relative'
                                    }}
                                >
                                    {notification.status === 'unread' && (
                                        <div style={{
                                            position: 'absolute',
                                            left: '0.5rem',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            width: '6px',
                                            height: '6px',
                                            backgroundColor: 'var(--info)',
                                            borderRadius: '50%'
                                        }} />
                                    )}

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--tertiary-dark)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem',
                                            flexShrink: 0
                                        }}>
                                            <Icon
                                                name={notification.type === 'collaboration_invite' ? 'briefcase' :
                                                    notification.type === 'collaboration_message' ? 'message-square' :
                                                        notification.type === 'collaboration_accepted' ? 'check' : 'bell'}
                                                size="sm"
                                            />
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{
                                                margin: '0 0 0.25rem 0',
                                                fontSize: '0.9rem',
                                                color: 'var(--text-primary)',
                                                lineHeight: '1.3'
                                            }}>
                                                {notification.title}
                                            </h4>
                                            <p style={{
                                                margin: '0 0 0.5rem 0',
                                                fontSize: '0.8rem',
                                                color: 'var(--text-secondary)',
                                                lineHeight: '1.4'
                                            }}>
                                                {notification.message}
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    color: 'var(--text-muted)'
                                                }}>
                                                    Just now
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dismissNotification(notification.id);
                                                    }}
                                                    className="btn-text"
                                                    style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}
                                                >
                                                    <Icon name="x" size="xs" />
                                                    Dismiss
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;