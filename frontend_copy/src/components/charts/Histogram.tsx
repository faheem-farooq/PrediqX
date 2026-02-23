import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface HistogramProps {
    bins: number[];
    counts: number[];
    title: string;
    color?: string;
}

const Histogram: React.FC<HistogramProps> = ({ bins, counts, title, color = "#82ca9d" }) => {
    // Combine bins and counts into a data format Recharts understands
    // bins has N+1 elements (edges), counts has N elements
    const chartData = counts.map((count, index) => ({
        range: `${bins[index].toFixed(1)} - ${bins[index + 1].toFixed(1)}`,
        count: count,
        // Use the midpoint for axis label if needed, or just range string
        mid: (bins[index] + bins[index + 1]) / 2
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg">
                    <p className="text-slate-200 font-medium">Range: {label}</p>
                    <p className="text-emerald-400">Count: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-slate-300 mb-2 font-medium text-center">{title}</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} barCategoryGap={1}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="range" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={60} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
                        <Bar dataKey="count" fill={color} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Histogram;
