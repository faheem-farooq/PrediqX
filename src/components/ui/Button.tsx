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
        primary: "bg-black text-white hover:bg-slate-800 shadow-sm active:scale-[0.98]",
        secondary: "bg-surface text-slate-900 hover:bg-slate-200 border border-edge",
        outline: "border border-edge bg-transparent hover:bg-slate-50 text-slate-700",
        ghost: "hover:bg-slate-50 text-slate-500 hover:text-slate-900",
    };

    const sizes = {
        sm: "h-9 px-4 text-xs rounded-full",
        md: "h-11 px-6 py-2 text-sm rounded-full",
        lg: "h-14 px-10 text-base rounded-full",
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
