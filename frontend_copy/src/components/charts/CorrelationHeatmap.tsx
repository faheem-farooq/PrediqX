import React from 'react';

interface HeatmapProps {
    data: {
        features: string[];
        matrix: (number | null)[][];
    };
    title: string;
}

const CorrelationHeatmap: React.FC<HeatmapProps> = ({ data, title }) => {
    const { features, matrix } = data;

    // Function to get color based on correlation value (-1 to 1)
    const getColor = (value: number | null) => {
        if (value === null) return 'bg-slate-800'; // No correlation/NaN

        // Scale -1 to 1 to a color range
        // Red for negative, Blue for positive, White/Grey for 0
        if (value >= 0) {
            // 0 to 1 -> White to Blue
            const alpha = Math.abs(value);
            return `rgba(59, 130, 246, ${alpha})`; // Blue-500 with opacity
        } else {
            // -1 to 0 -> White to Red
            const alpha = Math.abs(value);
            return `rgba(239, 68, 68, ${alpha})`; // Red-500 with opacity
        }
    };

    return (
        <div className="w-full h-full flex flex-col overflow-auto">
            <h3 className="text-slate-300 mb-4 font-medium text-center">{title}</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                    <thead>
                        <tr>
                            <th className="p-1"></th>
                            {features.map((feature, i) => (
                                <th key={i} className="p-1 text-slate-400 font-normal rotate-45 h-20 align-bottom">{feature}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <td className="p-1 text-slate-400 font-normal text-right pr-2">{features[i]}</td>
                                {row.map((val, j) => (
                                    <td
                                        key={j}
                                        className="p-1 border border-slate-800 w-12 h-12 text-center"
                                        style={{ backgroundColor: getColor(val) }}
                                        title={`${features[i]} vs ${features[j]}: ${val?.toFixed(2)}`}
                                    >
                                        <span className="text-[10px] text-white drop-shadow-md font-medium">
                                            {val !== null ? val.toFixed(1) : '-'}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CorrelationHeatmap;
