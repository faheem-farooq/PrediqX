import React from 'react';
import type { Recommendation } from '../../services/api';

interface RecommendationsTableProps {
    recommendations: Recommendation[];
}

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({ recommendations }) => {
    const getBadgeColor = (type: string, value: string) => {
        const v = value.toLowerCase();
        if (type === 'impact') {
            if (v === 'high') return 'bg-green-900/50 text-green-300 border-green-700';
            if (v === 'medium') return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
            return 'bg-gray-700 text-gray-300 border-gray-600';
        }
        if (type === 'effort') {
            if (v === 'low') return 'bg-green-900/50 text-green-300 border-green-700';
            if (v === 'medium') return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
            return 'bg-red-900/50 text-red-300 border-red-700'; // High effort is red
        }
        if (type === 'priority') {
            if (v === 'high') return 'bg-purple-900/50 text-purple-300 border-purple-700';
            if (v === 'medium') return 'bg-blue-900/50 text-blue-300 border-blue-700';
            return 'bg-gray-700 text-gray-300 border-gray-600';
        }
        return 'bg-gray-700 text-gray-300';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
                <thead className="bg-gray-800/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Impact</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Effort</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50 bg-transparent">
                    {recommendations.map((rec, idx) => (
                        <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-200">
                                {rec.action}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getBadgeColor('impact', rec.impact)}`}>
                                    {rec.impact}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getBadgeColor('effort', rec.effort)}`}>
                                    {rec.effort}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getBadgeColor('priority', rec.priority)}`}>
                                    {rec.priority}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecommendationsTable;
