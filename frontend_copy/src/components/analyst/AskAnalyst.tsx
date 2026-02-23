import React, { useState } from 'react';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { askAnalyst } from '../../services/api';

interface AskAnalystProps {
    fileId: string;
}

const AskAnalyst: React.FC<AskAnalystProps> = ({ fileId }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const result = await askAnalyst(fileId, question);
            setAnswer(result.answer);
        } catch (err) {
            setError("Failed to get a response. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-1 rounded-xl shadow-lg border border-gray-700/50">
            <div className="bg-gray-900/90 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Ask the Analyst</h3>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                    Have a specific question about this dataset? Ask below and get an instant data-driven answer.
                </p>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., What is the average churn rate for senior citizens?"
                        className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-4 pr-12 py-3 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !question.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                        {error}
                    </div>
                )}

                {answer && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                            <p className="text-gray-300 leading-relaxed font-light">
                                <span className="text-purple-400 font-semibold mr-2">Analyst:</span>
                                {answer}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AskAnalyst;
