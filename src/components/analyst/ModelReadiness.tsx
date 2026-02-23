import React from 'react';
import type { ModelReadiness as ModelReadinessType } from '../../services/api';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ModelReadinessProps {
    readiness: ModelReadinessType;
}

const ModelReadiness: React.FC<ModelReadinessProps> = ({ readiness }) => {

    return (
        <div className="bg-white/[0.01] p-10 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-white tracking-tight">Model Readiness Protocol</h3>
                <span className="px-4 py-1.5 bg-glow-blue/10 text-glow-blue border border-glow-blue/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {readiness.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {readiness.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-4 p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                        <div className={`p-2 rounded-lg ${item.status ? 'bg-glow-blue/5' : 'bg-yellow-400/5'}`}>
                            {item.status ? (
                                <CheckCircle2 className="w-5 h-5 text-glow-blue" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                            )}
                        </div>
                        <span className={`text-[15px] font-medium transition-colors ${item.status ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-300'}`}>
                            {item.item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelReadiness;
