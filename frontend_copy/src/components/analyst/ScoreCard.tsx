import React from 'react';

interface ScoreCardProps {
    title: string;
    score: number;
    description?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description }) => {
    const getColor = (s: number) => {
        if (s >= 80) return "text-green-400 border-green-400";
        if (s >= 60) return "text-yellow-400 border-yellow-400";
        return "text-red-400 border-red-400";
    };

    const colorClass = getColor(score);

    return (
        <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm flex flex-col items-center justify-center text-center">
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>

            <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center mb-2 ${colorClass}`}>
                <span className="text-3xl font-bold text-white">{score}%</span>
            </div>

            {description && (
                <p className="text-xs text-gray-500 max-w-[80%]">{description}</p>
            )}
        </div>
    );
};

export default ScoreCard;
