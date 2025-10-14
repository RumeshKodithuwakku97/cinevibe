import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// In the User interface, update the role type to match artist.ts
export interface User {
    id: string;
    email: string;
    displayName: string;
    avatar?: string;
    role: 'artist' | 'viewer' | 'admin'; // Add 'admin' to match artist.ts
    joinedDate: Date;
    isVerified: boolean;
}
// Add this interface near the other types
export interface RelatedEntity {
    type: string;
    id: string;
}

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    createdAt: Date;
    readAt?: Date;
    sender?: User;
    recipient: User;
    actionUrl?: string;
    relatedEntity?: RelatedEntity; // Add this line
}


export type NotificationType =
    | 'collaboration_invite'
    | 'collaboration_message'
    | 'collaboration_accepted'
    | 'collaboration_rejected'
    | 'collaboration_completed'
    | 'new_follower'
    | 'portfolio_like'
    | 'portfolio_comment'
    | 'system_announcement';

export type NotificationStatus = 'unread' | 'read';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    status: NotificationStatus;
    createdAt: Date;
    readAt?: Date;
    sender?: User;
    recipient: User;
    actionUrl?: string;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
}

export interface NotificationContextType {
    notificationState: NotificationState;
    addNotification: (notificationData: Omit<Notification, 'id' | 'createdAt' | 'status'>) => void;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    dismissNotification: (notificationId: string) => void;
    clearAll: () => void;
}

// Initial state
const initialNotificationState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false
};

// Reducer
type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_AS_READ'; payload: string }
    | { type: 'MARK_ALL_AS_READ' }
    | { type: 'DISMISS_NOTIFICATION'; payload: string }
    | { type: 'CLEAR_ALL' }
    | { type: 'SET_NOTIFICATIONS'; payload: Notification[] };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            const newNotifications = [action.payload, ...state.notifications];
            return {
                ...state,
                notifications: newNotifications,
                unreadCount: newNotifications.filter(n => n.status === 'unread').length
            };
        case 'MARK_AS_READ':
            const updatedNotifications = state.notifications.map(notification =>
                notification.id === action.payload
                    ? { ...notification, status: 'read' as NotificationStatus, readAt: new Date() }
                    : notification
            );
            return {
                ...state,
                notifications: updatedNotifications,
                unreadCount: updatedNotifications.filter(n => n.status === 'unread').length
            };
        case 'MARK_ALL_AS_READ':
            const allReadNotifications = state.notifications.map(notification => ({
                ...notification,
                status: 'read' as NotificationStatus,
                readAt: new Date()
            }));
            return {
                ...state,
                notifications: allReadNotifications,
                unreadCount: 0
            };
        case 'DISMISS_NOTIFICATION':
            const filteredNotifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
            return {
                ...state,
                notifications: filteredNotifications,
                unreadCount: filteredNotifications.filter(n => n.status === 'unread').length
            };
        case 'CLEAR_ALL':
            return initialNotificationState;
        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload,
                unreadCount: action.payload.filter(n => n.status === 'unread').length
            };
        default:
            return state;
    }
};

// Context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notificationState, dispatch] = useReducer(notificationReducer, initialNotificationState);

    const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'status'>) => {
        const newNotification: Notification = {
            ...notificationData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            status: 'unread'
        };

        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    };

    const markAsRead = (notificationId: string) => {
        dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    };

    const markAllAsRead = () => {
        dispatch({ type: 'MARK_ALL_AS_READ' });
    };

    const dismissNotification = (notificationId: string) => {
        dispatch({ type: 'DISMISS_NOTIFICATION', payload: notificationId });
    };

    const clearAll = () => {
        dispatch({ type: 'CLEAR_ALL' });
    };

    React.useEffect(() => {
        const savedNotifications = localStorage.getItem('artvibe_notifications');
        if (savedNotifications) {
            try {
                const parsedData = JSON.parse(savedNotifications);
                const typedNotifications: Notification[] = parsedData.map((item: any) => ({
                    ...item,
                    status: item.status as NotificationStatus,
                    createdAt: new Date(item.createdAt),
                    readAt: item.readAt ? new Date(item.readAt) : undefined
                }));

                dispatch({ type: 'SET_NOTIFICATIONS', payload: typedNotifications });
            } catch (error) {
                localStorage.removeItem('artvibe_notifications');
            }
        }
    }, []);

    React.useEffect(() => {
        localStorage.setItem('artvibe_notifications', JSON.stringify(notificationState.notifications));
    }, [notificationState.notifications]);

    const value: NotificationContextType = {
        notificationState,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        clearAll
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};