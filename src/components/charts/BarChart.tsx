import React from 'react';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

interface BarChartProps {
    data: { [key: string]: number };
    title: string;
    color?: string;
    showPercentages?: boolean;
    percentages?: { [key: string]: number };
}

const BarChart: React.FC<BarChartProps> = ({
    data,
    title,
    color = "#8884d8",
    showPercentages = false,
    percentages = {}
}) => {
    const chartData = Object.entries(data).map(([name, value]) => ({
        name: name.length > 10 ? name.substring(0, 10) + '...' : name,
        fullName: name,
        value,
        percentage: percentages[name] || 0
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Feature</p>
                    <p className="text-slate-900 font-bold mb-2">{payload[0].payload.fullName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Count</p>
                    <p className="text-glow-blue font-bold">{payload[0].value}</p>
                    {showPercentages && (
                        <>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2 mb-1">Distribution</p>
                            <p className="text-emerald-500 font-bold">{payload[0].payload.percentage.toFixed(1)}%</p>
                        </>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = (props: any) => {
        const { x, y, width, value } = props;
        if (!showPercentages || value === undefined || value === null) return null;

        return (
            <text
                x={x + width / 2}
                y={y - 5}
                fill="#94a3b8"
                textAnchor="middle"
                fontSize={11}
            >
                {typeof value === 'number' ? `${value.toFixed(1)}%` : value}
            </text>
        );
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-slate-300 mb-2 font-medium text-center">{title}</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#CBD5E1"
                            tick={{ fill: '#64748B', fontSize: 10 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            stroke="#CBD5E1"
                            tick={{ fill: '#64748B', fontSize: 10 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC', opacity: 0.5 }} />
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
                            {showPercentages && (
                                <LabelList
                                    dataKey="percentage"
                                    content={renderCustomLabel}
                                />
                            )}
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? color : '#10B981'} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BarChart;
