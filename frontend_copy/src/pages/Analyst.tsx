import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAnalystReport, type AnalystReport } from '../services/api';
import Navbar from '../layouts/Navbar';
import Button from '../components/ui/Button';
import { BrainCircuit, FileText, ChevronRight, AlertTriangle, Layers, Target, CheckCircle2 } from 'lucide-react';
import ReportSection from '../components/analyst/ReportSection';
import ScoreCard from '../components/analyst/ScoreCard';
import RecommendationsTable from '../components/analyst/RecommendationsTable';
import ModelReadiness from '../components/analyst/ModelReadiness';
import AskAnalyst from '../components/analyst/AskAnalyst';

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
            <div className="min-h-screen bg-[#0F1117] font-sans pb-20">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 text-center">
                    <div className="bg-gray-800/50 p-12 rounded-2xl border border-gray-700/50 max-w-2xl mx-auto backdrop-blur-sm">
                        <FileText className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">No Dataset Found</h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Please upload and analyze a dataset before accessing the Analyst module.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/upload')}
                            className="inline-flex items-center"
                        >
                            Go to Upload
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F1117] font-sans pb-20 text-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                    <BrainCircuit className="w-8 h-8 text-purple-400" />
                                </div>
                                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                    AI Executive Analyst
                                </h1>
                            </div>
                            <p className="text-gray-400 text-lg">
                                Advanced decisions support for <span className="text-purple-300 font-medium">{fileName}</span>
                            </p>
                        </div>

                        {!report && (
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleGenerateReport}
                                disabled={loading}
                                className="shadow-lg shadow-purple-900/20"
                            >
                                {loading ? "Analyzing..." : "Generate Analysis Report"}
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-900/20 border border-red-800/50 rounded-xl flex items-center text-red-200">
                        <AlertTriangle className="w-5 h-5 mr-3" />
                        {error}
                    </div>
                )}

                {report && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* 1. Score Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ScoreCard
                                title="Data Quality Score"
                                score={report.data_quality_score}
                                description="Assessed based on missing values, duplicates, and consistency."
                            />
                            <ScoreCard
                                title="Analysis Confidence"
                                score={report.analysis_confidence_score}
                                description="Calculated from sample size and feature clarity."
                            />
                        </div>

                        {/* 2. Executive Summary */}
                        <ReportSection title="Executive Summary" icon={FileText} defaultOpen={true}>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                                {report.executive_summary}
                            </p>
                        </ReportSection>

                        {/* 3. Key Patterns (Evidence Based) & Risk Assessment */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ReportSection title="Key Patterns" icon={Layers} defaultOpen={true}>
                                <ul className="space-y-4">
                                    {report.key_patterns.map((item, idx) => (
                                        <li key={idx} className="flex items-start text-gray-300">
                                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2.5 mr-3 flex-shrink-0" />
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </ReportSection>

                            <ReportSection title="Risk Assessment" icon={AlertTriangle} defaultOpen={true}>
                                <ul className="space-y-4">
                                    {report.risk_flags.map((item, idx) => (
                                        <li key={idx} className="flex items-start text-gray-300">
                                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2.5 mr-3 flex-shrink-0" />
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </ReportSection>
                        </div>

                        {/* 4. Model Readiness */}
                        <div className="grid grid-cols-1 gap-8">
                            <ModelReadiness readiness={report.model_readiness} />
                        </div>

                        {/* 5. Segment Insights */}
                        <ReportSection title="Segment Insights" icon={Target} defaultOpen={false}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {report.segment_insights.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                                        <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </ReportSection>

                        {/* 6. Strategic Recommendations Table */}
                        <ReportSection title="Strategic Recommendations" icon={CheckCircle2} defaultOpen={true}>
                            <RecommendationsTable recommendations={report.recommended_actions} />
                        </ReportSection>

                        {/* 7. Data Quality Notes */}
                        <ReportSection title="Data Quality Notes" icon={FileText} defaultOpen={false}>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {report.data_quality_notes.map((item, idx) => (
                                    <li key={idx} className="flex items-center text-gray-400 text-sm bg-gray-900/30 p-3 rounded-lg border border-gray-800">
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </ReportSection>

                        {/* 8. Ask the Analyst */}
                        <AskAnalyst fileId={fileId} />

                        <div className="h-20" /> {/* Bottom Spacer */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Analyst;
