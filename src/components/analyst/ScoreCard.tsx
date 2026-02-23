import React from 'react';

interface ScoreCardProps {
    title: string;
    score: number;
    description?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">{title}</h3>

            <div className="relative w-32 h-32 flex items-center justify-center mb-10">
                <svg className="w-full h-full -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-200/50"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="text-glow-blue transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900 tabular-nums tracking-tighter">{score}%</span>
                </div>
            </div>

            {description && (
                <p className="text-sm text-slate-500 max-w-[90%] leading-relaxed font-medium">{description}</p>
            )}
        </div>
    );
};

export default ScoreCard;
