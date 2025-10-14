import React from 'react';
// @ts-ignore
import { ButtonProps } from '../types/artist';

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           variant = 'primary',
                                           disabled = false,
                                           size = 'md'
                                       }) => {
    // This component logic can be simplified as most styling is now in App.css
    const className = `btn btn-${variant} btn-${size}`;

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;