import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, description }) => {
    return (
        <div className={`bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden ${className}`}>
            {(title || description) && (
                <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};

export default Card;
