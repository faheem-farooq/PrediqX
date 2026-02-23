import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700",
        outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300",
        ghost: "hover:bg-slate-800 text-slate-400 hover:text-white",
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-8 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
