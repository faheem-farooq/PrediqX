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
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Range</p>
                    <p className="text-slate-900 font-bold mb-2">{label}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Frequency</p>
                    <p className="text-glow-blue font-bold">{payload[0].value}</p>
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
                    <RechartsBarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }} barCategoryGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis
                            dataKey="range"
                            stroke="#CBD5E1"
                            tick={{ fill: '#64748B', fontSize: 10 }}
                            interval="preserveStartEnd"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            tickMargin={10}
                        />
                        <YAxis
                            stroke="#CBD5E1"
                            tick={{ fill: '#64748B', fontSize: 10 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC', opacity: 0.5 }} />
                        <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Histogram;
