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
        if (value === null) return '#F8FAFC'; // Empty

        const alpha = Math.abs(value);
        if (value >= 0) {
            // positive -> Blue
            return `rgba(37, 99, 235, ${alpha})`;
        } else {
            // negative -> Slate/Gray
            return `rgba(71, 85, 105, ${alpha})`;
        }
    };

    // Helper to determine text color for contrast
    const getTextColor = (value: number | null) => {
        if (value === null) return 'text-slate-400';
        return Math.abs(value) > 0.45 ? 'text-white font-bold' : 'text-slate-900 font-medium';
    };

    return (
        <div className="w-full h-full flex flex-col overflow-visible">
            <h3 className="text-slate-400 mb-8 font-bold text-[10px] uppercase tracking-widest text-center">{title}</h3>
            <div className="overflow-x-auto pb-8">
                <table className="mx-auto border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2"></th>
                            {features.map((feature, i) => (
                                <th key={i} className="p-2 text-slate-400 text-[10px] font-bold uppercase tracking-tighter rotate-45 h-24 align-bottom text-left">
                                    <div className="w-8">{feature}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr key={i}>
                                <td className="p-2 text-slate-500 text-[10px] font-bold uppercase tracking-tighter text-right pr-4 whitespace-nowrap">
                                    {features[i]}
                                </td>
                                {row.map((val, j) => (
                                    <td
                                        key={j}
                                        className="p-0 border border-white w-14 h-14 relative"
                                        style={{ backgroundColor: getColor(val) }}
                                        title={`${features[i]} vs ${features[j]}: ${val?.toFixed(2)}`}
                                    >
                                        <div className={`absolute inset-0 flex items-center justify-center text-[11px] ${getTextColor(val)}`}>
                                            {val !== null ? val.toFixed(2) : '-'}
                                        </div>
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
