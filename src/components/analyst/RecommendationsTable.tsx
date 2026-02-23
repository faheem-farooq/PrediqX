import React from 'react';
import type { Recommendation } from '../../services/api';

interface RecommendationsTableProps {
    recommendations: Recommendation[];
}

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({ recommendations }) => {
    const getBadgeColor = (type: string, value: string) => {
        const v = value.toLowerCase();
        if (type === 'impact') {
            if (v === 'high') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            if (v === 'medium') return 'bg-blue-50 text-blue-700 border-blue-100';
            return 'bg-slate-50 text-slate-600 border-slate-200';
        }
        if (type === 'effort') {
            if (v === 'low') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            if (v === 'medium') return 'bg-amber-50 text-amber-700 border-amber-100';
            return 'bg-rose-50 text-rose-700 border-rose-100';
        }
        if (type === 'priority') {
            if (v === 'high') return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            if (v === 'medium') return 'bg-slate-100 text-slate-700 border-slate-200';
            return 'bg-white text-slate-400 border-slate-100';
        }
        return 'bg-slate-50 text-slate-600';
    };

    return (
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Strategic Action</th>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Potential Impact</th>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Effort</th>
                            <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {recommendations.map((rec, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors duration-200">
                                <td className="px-8 py-6 text-[15px] font-bold text-slate-900 max-w-sm leading-relaxed">
                                    {rec.action}
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className={`px-4 py-1.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full border ${getBadgeColor('impact', rec.impact)}`}>
                                        {rec.impact}
                                    </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className={`px-4 py-1.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full border ${getBadgeColor('effort', rec.effort)}`}>
                                        {rec.effort}
                                    </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                    <span className={`px-4 py-1.5 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full border ${getBadgeColor('priority', rec.priority)}`}>
                                        {rec.priority}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecommendationsTable;
