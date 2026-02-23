import React from 'react';

interface BoxplotData {
    q1: number;
    q3: number;
    median: number;
    whisker_low: number;
    whisker_high: number;
    outliers: number[];
}

interface BoxplotProps {
    data: BoxplotData;
    title?: string;
    width?: number;
    height?: number;
}

const Boxplot: React.FC<BoxplotProps> = ({ data, title = "", width = 300, height = 200 }) => {
    const { q1, q3, median, whisker_low, whisker_high, outliers } = data;

    // Calculate positions (normalized to 0-100 range)
    const range = whisker_high - whisker_low;
    const padding = 20;
    const chartHeight = height - padding * 2;

    const normalize = (value: number) => {
        if (range === 0) return chartHeight / 2;
        return chartHeight - ((value - whisker_low) / range) * chartHeight;
    };

    const q1Pos = normalize(q1);
    const q3Pos = normalize(q3);
    const medianPos = normalize(median);
    const whiskerLowPos = normalize(whisker_low);
    const whiskerHighPos = normalize(whisker_high);

    const boxWidth = 60;
    const centerX = width / 2;

    return (
        <div className="w-full h-full flex flex-col items-center">
            {title && <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">{title}</h4>}
            <svg width={width} height={height} className="overflow-visible">
                {/* Whisker lines */}
                <line
                    x1={centerX}
                    y1={whiskerHighPos + padding}
                    x2={centerX}
                    y2={q3Pos + padding}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                />
                <line
                    x1={centerX}
                    y1={q1Pos + padding}
                    x2={centerX}
                    y2={whiskerLowPos + padding}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                />

                {/* Whisker caps */}
                <line
                    x1={centerX - 10}
                    y1={whiskerHighPos + padding}
                    x2={centerX + 10}
                    y2={whiskerHighPos + padding}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                />
                <line
                    x1={centerX - 10}
                    y1={whiskerLowPos + padding}
                    x2={centerX + 10}
                    y2={whiskerLowPos + padding}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                />

                {/* Box (IQR) */}
                <rect
                    x={centerX - boxWidth / 2}
                    y={q3Pos + padding}
                    width={boxWidth}
                    height={Math.max(q1Pos - q3Pos, 1)}
                    fill="#3b82f6"
                    fillOpacity="0.1"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    rx="2"
                />

                {/* Median line */}
                <line
                    x1={centerX - boxWidth / 2}
                    y1={medianPos + padding}
                    x2={centerX + boxWidth / 2}
                    y2={medianPos + padding}
                    stroke="#2563eb"
                    strokeWidth="2"
                />

                {/* Outliers */}
                {outliers.slice(0, 20).map((outlier, idx) => {
                    const outlierPos = normalize(outlier);
                    return (
                        <circle
                            key={idx}
                            cx={centerX + (Math.random() - 0.5) * 20}
                            cy={outlierPos + padding}
                            r="3"
                            fill="#ef4444"
                            opacity="0.7"
                        />
                    );
                })}

                {/* Labels */}
                <text x={centerX + boxWidth / 2 + 10} y={whiskerHighPos + padding + 5} fill="#64748B" fontSize="10" fontWeight="bold">
                    {whisker_high.toFixed(1)}
                </text>
                <text x={centerX + boxWidth / 2 + 10} y={q3Pos + padding + 5} fill="#3b82f6" fontSize="10" fontWeight="bold">
                    Q3: {q3.toFixed(1)}
                </text>
                <text x={centerX + boxWidth / 2 + 10} y={medianPos + padding + 5} fill="#2563eb" fontSize="10" fontWeight="bold">
                    Med: {median.toFixed(1)}
                </text>
                <text x={centerX + boxWidth / 2 + 10} y={q1Pos + padding + 5} fill="#3b82f6" fontSize="10" fontWeight="bold">
                    Q1: {q1.toFixed(1)}
                </text>
                <text x={centerX + boxWidth / 2 + 10} y={whiskerLowPos + padding + 5} fill="#64748B" fontSize="10" fontWeight="bold">
                    {whisker_low.toFixed(1)}
                </text>
            </svg>
        </div>
    );
};

export default Boxplot;
