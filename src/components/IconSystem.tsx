import React from 'react';
import {
    FiHome, FiUsers, FiBriefcase, FiBell, FiMessageSquare, FiUser, FiSearch,
    FiPlus, FiFilm, FiCamera, FiMusic, FiPenTool, FiHeart, FiShare2, FiBookmark,
    FiSettings, FiEdit, FiTrash2, FiEye, FiEyeOff, FiLock, FiUnlock, FiMail,
    FiPhone, FiMapPin, FiGlobe, FiStar, FiAward, FiTrendingUp, FiCheck, FiX,
    FiArrowRight, FiArrowLeft, FiArrowUp, FiArrowDown, FiLogOut, FiLogIn,
    FiUserPlus, FiRefreshCw, FiXCircle, FiExternalLink, FiLink, FiDownload,
    FiUpload, FiImage, FiVideo, FiFileText, FiFolder, FiGrid, FiList, FiLayout,
    FiFilter, FiMenu, FiClock, FiCalendar, FiDollarSign, FiBarChart2,
    FiPlay // <-- 1. ADD THIS IMPORT
} from 'react-icons/fi';

// Comprehensive icon mapping
const iconComponents = {
    // Navigation & UI
    'home': FiHome,
    'users': FiUsers,
    'briefcase': FiBriefcase,
    'bell': FiBell,
    'message-square': FiMessageSquare,
    'user': FiUser,
    'search': FiSearch,
    'plus': FiPlus,
    'menu': FiMenu,
    'filter': FiFilter,
    'grid': FiGrid,
    'list': FiList,
    'layout': FiLayout,

    // Art Types
    'film': FiFilm,
    'camera': FiCamera,
    'music': FiMusic,
    'pen-tool': FiPenTool,
    'image': FiImage,
    'video': FiVideo,
    'play': FiPlay, // <-- 2. ADD THIS LINE

    // Actions
    'heart': FiHeart,
    'share': FiShare2,
    'bookmark': FiBookmark,
    'settings': FiSettings,
    'edit': FiEdit,
    'trash': FiTrash2,
    'eye': FiEye,
    'eye-off': FiEyeOff,
    'lock': FiLock,
    'unlock': FiUnlock,
    'check': FiCheck,
    'x': FiX,
    'x-circle': FiXCircle,
    'refresh': FiRefreshCw,
    'download': FiDownload,
    'upload': FiUpload,
    'external-link': FiExternalLink,
    'link': FiLink,

    // Social & Contact
    'mail': FiMail,
    'phone': FiPhone,
    'map-pin': FiMapPin,
    'globe': FiGlobe,

    // Status & Metrics
    'star': FiStar,
    'award': FiAward,
    'trending-up': FiTrendingUp,
    'bar-chart': FiBarChart2,
    'dollar': FiDollarSign,
    'calendar': FiCalendar,
    'clock': FiClock,

    // Arrows
    'arrow-right': FiArrowRight,
    'arrow-left': FiArrowLeft,
    'arrow-up': FiArrowUp,
    'arrow-down': FiArrowDown,

    // User & Auth
    'log-out': FiLogOut,
    'log-in': FiLogIn,
    'user-plus': FiUserPlus,

    // Files
    'file-text': FiFileText,
    'folder': FiFolder,
} as const;

export type IconName = keyof typeof iconComponents;
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IconProps {
    name: IconName;
    size?: IconSize;
    className?: string;
    color?: string;
    onClick?: () => void;
}

const sizeMap: Record<IconSize, string> = {
    'xs': 'icon-xs',
    'sm': 'icon-sm',
    'md': 'icon-md',
    'lg': 'icon-lg',
    'xl': 'icon-xl',
    '2xl': 'icon-2xl'
};

export const Icon: React.FC<IconProps> = ({
                                              name,
                                              size = 'md',
                                              className = '',
                                              color,
                                              onClick
                                          }) => {
    const IconComponent = iconComponents[name];
    const sizeClass = sizeMap[size];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found`);
        return null;
    }

    const IconElement = IconComponent as React.ComponentType<{ className?: string }>;

    return (
        <span
            className={`icon ${sizeClass} ${className}`}
            style={color ? { color } : undefined}
            onClick={onClick}
        >
      <IconElement />
    </span>
    );
};

export default Icon;