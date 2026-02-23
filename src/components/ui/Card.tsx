import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, description }) => {
    return (
        <div className={`bg-white rounded-[2rem] border border-edge transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 overflow-hidden ${className}`}>
            {(title || description) && (
                <div className="px-10 py-8 border-b border-edge bg-surface/30">
                    {title && <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>}
                    {description && <p className="text-sm text-slate-500 mt-2">{description}</p>}
                </div>
            )}
            <div className="p-10">
                {children}
            </div>
        </div>
    );
};

export default Card;
