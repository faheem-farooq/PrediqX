import React, { useState } from 'react';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { askAnalyst } from '../../services/api';

interface AskAnalystProps {
    fileId: string;
}

interface Message {
    role: 'user' | 'ai';
    content: string;
}

const AskAnalyst: React.FC<AskAnalystProps> = ({ fileId }) => {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const currentQuestion = question.trim();
        if (!currentQuestion) return;

        setLoading(true);
        setError(null);

        // Add user message to stack
        const newUserMessage: Message = { role: 'user', content: currentQuestion };
        setMessages(prev => [...prev, newUserMessage]);
        setQuestion("");

        try {
            const result = await askAnalyst(fileId, currentQuestion);
            // Add AI response to stack
            const newAiMessage: Message = { role: 'ai', content: result.answer };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (err) {
            setError("The analyst is currently offline. Please try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB] rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header Area */}
            <div className="p-8 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">AI Dataset Analyst</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-lg font-medium">
                    Interrogate your dataset using natural language. Receive strategic insights and recommended actions.
                </p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-8 space-y-6 overflow-y-auto min-h-[400px] max-h-[600px] scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-20">
                        <Sparkles className="w-12 h-12 text-blue-500" />
                        <p className="text-slate-600 font-medium max-w-xs leading-relaxed">
                            Start by asking a question about correlations, trends, risks, or performance metrics.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-6 py-4 rounded-3xl shadow-sm text-[15px] leading-relaxed font-medium ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 text-slate-500 px-6 py-4 rounded-3xl rounded-tl-none shadow-sm flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm font-medium italic">Processing Intelligence...</span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white border-t border-slate-200">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask a question about your dataset..."
                            disabled={loading}
                            className="w-full h-16 pl-8 pr-16 bg-slate-50 border border-slate-200 rounded-full text-slate-900 font-medium text-lg placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-20 disabled:grayscale transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AskAnalyst;
