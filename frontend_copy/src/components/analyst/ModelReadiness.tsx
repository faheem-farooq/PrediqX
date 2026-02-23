import React from 'react';
import type { ModelReadiness as ModelReadinessType } from '../../services/api';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface ModelReadinessProps {
    readiness: ModelReadinessType;
}

const ModelReadiness: React.FC<ModelReadinessProps> = ({ readiness }) => {

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Model Readiness</h3>
                <span className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-700/50 rounded-full text-sm font-medium">
                    {readiness.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readiness.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-900/30 rounded-lg border border-gray-700/30">
                        {item.status ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        )}
                        <span className={`text-sm ${item.status ? 'text-gray-300' : 'text-gray-200 font-medium'}`}>
                            {item.item}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelReadiness;
