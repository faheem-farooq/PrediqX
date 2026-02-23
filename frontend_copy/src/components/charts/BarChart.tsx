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
                <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg">
                    <p className="text-slate-200 font-medium">{payload[0].payload.fullName}</p>
                    <p className="text-blue-400">Count: {payload[0].value}</p>
                    {showPercentages && (
                        <p className="text-green-400">{payload[0].payload.percentage.toFixed(1)}%</p>
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
                    <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]}>
                            {showPercentages && (
                                <LabelList
                                    dataKey="percentage"
                                    content={renderCustomLabel}
                                />
                            )}
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? color : '#6366f1'} />
                            ))}
                        </Bar>
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BarChart;
