import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAnalystReport, type AnalystReport } from '../services/api';
import Navbar from '../layouts/Navbar';
import Button from '../components/ui/Button';
import { FileText, ChevronRight, AlertTriangle } from 'lucide-react';
import ScoreCard from '../components/analyst/ScoreCard';
import RecommendationsTable from '../components/analyst/RecommendationsTable';
import AskAnalyst from '../components/analyst/AskAnalyst';
import { motion } from 'framer-motion';

const Analyst = () => {
    const navigate = useNavigate();
    const [fileId, setFileId] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [report, setReport] = useState<AnalystReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedFileId = localStorage.getItem("currentFileId") || localStorage.getItem("fileId");
        const storedFileName = localStorage.getItem("currentFileName");
        setFileId(storedFileId);
        setFileName(storedFileName);
    }, []);

    const handleGenerateReport = async () => {
        if (!fileId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await generateAnalystReport(fileId);
            setReport(data);
        } catch (err) {
            setError("Failed to generate report. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!fileId) {
        return (
            <div className="min-h-screen bg-white font-sans pb-48">
                <Navbar />
                <div className="max-w-7xl mx-auto px-10 pt-48 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface p-20 rounded-[3rem] border border-edge max-w-2xl mx-auto"
                    >
                        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-10" />
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tighter">Access Protocol Required</h2>
                        <p className="text-slate-500 mb-12 text-xl font-medium">
                            Please provide a dataset for the AI Executive system to perform contextual analysis.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/upload')}
                            className="inline-flex items-center px-10 py-5 rounded-full"
                        >
                            Return to Upload
                            <ChevronRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans pb-48 transition-colors duration-500">
            <Navbar />

            <main className="max-w-5xl mx-auto px-10 pt-48 pb-64">
                {/* Header - Executive Report Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="mb-32"
                >
                    <div className="flex items-center space-x-4 mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Intelligence Report IA-700</span>
                    </div>

                    <h1 className="text-7xl font-bold text-slate-900 tracking-tighter mb-8 leading-none">
                        Executive <span className="text-glow-blue italic">Analysis</span>.
                    </h1>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-edge pb-16">
                        <p className="text-slate-500 text-2xl font-medium max-w-xl leading-relaxed">
                            Contextual decision support for <span className="text-glow-blue">{fileName}</span>
                        </p>

                        {!report && (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className="px-12 py-6 rounded-full"
                            >
                                {loading ? "Analyzing..." : "Generate Analysis"}
                            </Button>
                        )}
                    </div>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-16 p-8 bg-red-50 border border-red-100 rounded-3xl flex items-center text-red-600"
                    >
                        <AlertTriangle className="w-6 h-6 mr-6" />
                        <span className="font-bold text-lg tracking-tight">{error}</span>
                    </motion.div>
                )}

                {report && (
                    <div className="space-y-48">
                        {/* 1. Score Cards - Floating Panels */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12"
                        >
                            <ScoreCard
                                title="Data Integrity"
                                score={report.data_quality_score}
                                description="Assessed based on missing values, duplicates, and structural consistency."
                            />
                            <ScoreCard
                                title="Analysis Confidence"
                                score={report.analysis_confidence_score}
                                description="Calculated based on sample size, feature clarity, and model stability."
                            />
                        </motion.div>

                        {/* 2. Executive Summary - Clean Typography */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <div className="mb-12 border-b border-edge pb-8 flex items-center justify-between">
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase">Executive Summary</h2>
                                <FileText className="w-5 h-5 text-slate-300" />
                            </div>
                            <div className="max-w-3xl text-2xl leading-relaxed text-slate-500 font-medium">
                                {report.executive_summary}
                            </div>
                        </motion.div>

                        {/* 3. Key Patterns & Risk Assessment */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                            <motion.div
                                className="lg:col-span-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="mb-10 flex items-center gap-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Key Patterns</h3>
                                    <div className="h-px flex-1 bg-edge" />
                                </div>
                                <ul className="space-y-10">
                                    {report.key_patterns.map((item, idx) => (
                                        <li key={idx} className="group relative pl-8">
                                            <div className="absolute left-0 top-3 w-1.5 h-1.5 bg-glow-blue rounded-full" />
                                            <span className="text-xl font-medium text-slate-600 leading-relaxed block">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                className="lg:col-span-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="mb-10 flex items-center gap-4">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-400">Risk Assessment</h3>
                                    <div className="h-px flex-1 bg-red-100" />
                                </div>
                                <ul className="space-y-10">
                                    {report.risk_flags.map((item, idx) => (
                                        <li key={idx} className="group relative pl-8 border-l-2 border-red-500/10 hover:border-red-500/40 transition-colors">
                                            <span className="text-xl font-medium text-slate-600 leading-relaxed block py-1">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* 4. Strategic Recommendations Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <div className="mb-16 flex items-center gap-8">
                                <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Strategic Moves</h2>
                                <div className="h-px flex-1 bg-edge" />
                            </div>
                            <RecommendationsTable recommendations={report.recommended_actions} />
                        </motion.div>

                        {/* 5. Ask the Analyst - Centered Chat Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                            className="mt-64 max-w-[1000px] mx-auto"
                        >
                            <AskAnalyst fileId={fileId} />
                        </motion.div>

                        <div className="h-32" /> {/* Bottom Spacer */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Analyst;
