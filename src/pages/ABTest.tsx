import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { runABTest, suggestABTestColumns, getEDA, type ABTestResponse } from '../services/api';
import Navbar from '../layouts/Navbar';
import Button from '../components/ui/Button';
import { FlaskConical, ChevronRight, AlertTriangle, Trophy, TrendingUp, BarChart3, Brain, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const ABTest = () => {
    const navigate = useNavigate();
    const [fileId, setFileId] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    // Form state
    const [columns, setColumns] = useState<string[]>([]);
    const [groupColumn, setGroupColumn] = useState('');
    const [metricColumn, setMetricColumn] = useState('');
    const [testType, setTestType] = useState('auto');
    const [mode, setMode] = useState<'auto' | 'manual'>('auto');

    // Results
    const [result, setResult] = useState<ABTestResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [columnsLoading, setColumnsLoading] = useState(false);

    useEffect(() => {
        const storedFileId = localStorage.getItem("currentFileId") || localStorage.getItem("fileId");
        const storedFileName = localStorage.getItem("currentFileName");
        setFileId(storedFileId);
        setFileName(storedFileName);

        if (storedFileId) {
            loadColumns(storedFileId);
        }
    }, []);

    const loadColumns = async (fid: string) => {
        setColumnsLoading(true);
        try {
            const edaData = await getEDA(fid);
            const allColumns = Object.keys(edaData.dataset_overview.data_types || {});
            setColumns(allColumns);
        } catch {
            try {
                const suggestions = await suggestABTestColumns(fid);
                const allCols = [
                    ...suggestions.suggested_group_columns.map(g => g.column),
                    ...suggestions.suggested_metric_columns.map(m => m.column),
                ];
                setColumns([...new Set(allCols)]);
            } catch {
                setError("Could not load dataset columns.");
            }
        } finally {
            setColumnsLoading(false);
        }
    };

    const handleRunTest = async () => {
        if (!fileId) return;
        if (mode === 'manual' && (!groupColumn || !metricColumn)) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await runABTest(fileId, groupColumn, metricColumn, testType, mode === 'auto');
            setResult(data);
        } catch (err: any) {
            setError(err.message || "Failed to run A/B test. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const canRun = fileId && !loading && (mode === 'auto' || (groupColumn && metricColumn && groupColumn !== metricColumn));

    // No dataset state
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
                        <FlaskConical className="w-16 h-16 text-slate-300 mx-auto mb-10" />
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tighter">Dataset Required</h2>
                        <p className="text-slate-500 mb-12 text-xl font-medium">
                            Upload a dataset first to run A/B experiments.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/upload')}
                            className="inline-flex items-center px-10 py-5 rounded-full"
                        >
                            Upload Dataset
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
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="mb-32"
                >
                    <div className="flex items-center space-x-4 mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">Experiment Protocol EX-100</span>
                    </div>

                    <h1 className="text-7xl font-bold text-slate-900 tracking-tighter mb-8 leading-none">
                        A/B <span className="text-glow-blue italic">Testing</span>.
                    </h1>

                    <p className="text-slate-500 text-2xl font-medium max-w-xl leading-relaxed border-b border-edge pb-16">
                        Compare variations and identify statistically better outcomes for <span className="text-glow-blue">{fileName}</span>
                    </p>
                </motion.div>

                {/* Input Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-surface border border-edge rounded-[2rem] p-12 mb-24"
                >
                    {/* Mode Toggle */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-white border border-edge rounded-full p-2 inline-flex items-center gap-2 relative">
                            <button
                                onClick={() => { setMode('auto'); setResult(null); setError(null); }}
                                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 relative z-10 ${
                                    mode === 'auto'
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                <Brain className="w-4 h-4" />
                                AI Auto Mode
                            </button>
                            <button
                                onClick={() => { setMode('manual'); setResult(null); setError(null); }}
                                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all relative z-10 ${
                                    mode === 'manual'
                                        ? 'bg-black text-white shadow-lg'
                                        : 'text-slate-500 hover:text-slate-900'
                                }`}
                            >
                                Manual Mode
                            </button>
                        </div>
                    </div>

                    <div className="mb-10 flex items-center gap-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {mode === 'auto' ? 'Automated Configuration' : 'Experiment Configuration'}
                        </h3>
                        <div className="h-px flex-1 bg-edge" />
                    </div>

                    {mode === 'manual' ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                {/* Group Column */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                        Group Column
                                    </label>
                                    <select
                                        value={groupColumn}
                                        onChange={(e) => setGroupColumn(e.target.value)}
                                        disabled={columnsLoading}
                                        className="w-full px-6 py-4 rounded-xl border border-edge bg-white text-slate-900 font-medium text-base focus:outline-none focus:ring-2 focus:ring-glow-blue/20 focus:border-glow-blue transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select group column...</option>
                                        {columns.map((col) => (
                                            <option key={col} value={col}>{col}</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-bold">Must have exactly 2 unique values</p>
                                </div>

                                {/* Metric Column */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                        Metric Column
                                    </label>
                                    <select
                                        value={metricColumn}
                                        onChange={(e) => setMetricColumn(e.target.value)}
                                        disabled={columnsLoading}
                                        className="w-full px-6 py-4 rounded-xl border border-edge bg-white text-slate-900 font-medium text-base focus:outline-none focus:ring-2 focus:ring-glow-blue/20 focus:border-glow-blue transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select metric column...</option>
                                        {columns.map((col) => (
                                            <option key={col} value={col}>{col}</option>
                                        ))}
                                    </select>
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-bold">Numeric or binary column to compare</p>
                                </div>
                            </div>

                            {/* Test Type */}
                            <div className="mb-12">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                                    Test Type
                                </label>
                                <div className="flex gap-4">
                                    {['auto', 't-test', 'chi-square'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setTestType(type)}
                                            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                                testType === type
                                                    ? 'bg-black text-white shadow-lg'
                                                    : 'bg-white border border-edge text-slate-500 hover:text-slate-900 hover:border-slate-300'
                                            }`}
                                        >
                                            {type === 'auto' ? '⚡ Auto' : type === 't-test' ? '📊 T-Test' : '📐 Chi-Square'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8 mb-12">
                            <Brain className="w-12 h-12 text-glow-blue mx-auto mb-4 opacity-50" />
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Autonomous Experimentation</h4>
                            <p className="text-slate-500 font-medium max-w-md mx-auto">
                                PredictX will automatically scan your dataset, identify valid configurations, and run multiple statistical tests to find the best insights.
                            </p>
                        </div>
                    )}

                    {/* Run Button */}
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleRunTest}
                        disabled={!canRun}
                        className="px-16 py-6 rounded-full w-full md:w-auto"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Running Experiment...
                            </span>
                        ) : (
                            <span className="flex items-center gap-3">
                                <FlaskConical className="w-4 h-4" />
                                Run A/B Test
                            </span>
                        )}
                    </Button>
                </motion.div>

                {/* Error */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-16 p-8 bg-red-50 border border-red-100 rounded-3xl flex items-center text-red-600"
                    >
                        <AlertTriangle className="w-6 h-6 mr-6 flex-shrink-0" />
                        <span className="font-bold text-lg tracking-tight">{error}</span>
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-40 bg-surface/30 rounded-[3rem] border border-edge mb-24">
                        <div className="h-1.5 w-48 bg-slate-100 rounded-full mx-auto mb-10 overflow-hidden relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-glow-blue w-12"
                                animate={{ x: [-48, 192] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Running Statistical Analysis...
                        </h3>
                        <p className="text-slate-500 mt-3 font-medium">
                            Computing significance tests and generating AI insights.
                        </p>
                    </div>
                )}

                {/* Results */}
                {result && result.success && (
                    <div className="space-y-24">
                        {mode === 'auto' && result.all_experiments && result.all_experiments.length > 0 ? (
                            <>
                                {/* Section 1: Top Insight */}
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                                    <div className="mb-12 flex items-center gap-4">
                                        <Trophy className="w-5 h-5 text-yellow-500" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section 1: Top Insight (AI Selected)</h3>
                                        <div className="h-px flex-1 bg-edge" />
                                    </div>
                                    
                                    <div className="bg-surface border-2 border-slate-900 rounded-[2rem] p-10 mb-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-bl-2xl">
                                            Highest Significance
                                        </div>
                                        <div className="flex items-center gap-4 mb-6 pt-2">
                                            <span className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
                                                {result.data.group_column} vs {result.data.metric_column}
                                            </span>
                                            {result.data.significant && (
                                                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-2 border border-green-200">
                                                    <Info className="w-3 h-3" /> Statistically Significant
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                                            Group <span className="text-glow-blue">'{result.data.group_a_mean > result.data.group_b_mean ? result.data.group_a_label : result.data.group_b_label}'</span> outperformed by {
                                                (() => {
                                                    const min = Math.min(result.data.group_a_mean, result.data.group_b_mean);
                                                    const max = Math.max(result.data.group_a_mean, result.data.group_b_mean);
                                                    if (min === 0) return 'N/A';
                                                    return `${(((max - min) / Math.abs(min)) * 100).toFixed(1)}%`;
                                                })()
                                            }
                                        </h4>
                                        <p className="text-slate-500 font-medium flex items-center gap-6">
                                            <span>P-Value: <strong className="text-slate-900">{result.data.p_value.toFixed(6)}</strong></span>
                                            <span>Effect Size: <strong className="text-slate-900">{result.data.effect_size.toFixed(4)}</strong></span>
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Section 2: All Tested Experiments */}
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
                                    <div className="mb-12 flex items-center gap-4">
                                        <FlaskConical className="w-5 h-5 text-slate-400" />
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section 2: All Tested Experiments</h3>
                                        <div className="h-px flex-1 bg-edge" />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {result.all_experiments.map((exp: any, idx: number) => (
                                            <div key={idx} className={`bg-surface border ${idx === 0 ? 'border-slate-900 shadow-md' : 'border-edge'} rounded-[1.5rem] p-8 relative`}>
                                                {idx === 0 && (
                                                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                                                        Best
                                                    </div>
                                                )}
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 flex justify-between items-center">
                                                    Config {idx + 1}
                                                    {exp.significant && <span className="w-2 h-2 rounded-full bg-green-500" title="Significant"></span>}
                                                </p>
                                                <h4 className="font-bold text-slate-900 text-lg mb-1 truncate" title={exp.group_column}>{exp.group_column}</h4>
                                                <p className="text-sm font-medium text-slate-500 mb-6 truncate" title={exp.metric_column}>vs {exp.metric_column}</p>
                                                
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between items-center border-b border-edge pb-2">
                                                        <span className="text-slate-500">Test Type</span>
                                                        <span className="font-bold text-slate-900 capitalize">{exp.test_type}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center border-b border-edge pb-2">
                                                        <span className="text-slate-500">P-Value</span>
                                                        <span className="font-bold text-slate-900">{exp.p_value.toFixed(4)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-slate-500">Difference</span>
                                                        <span className="font-bold text-slate-900">
                                                            {(() => {
                                                                const minM = Math.min(exp.group_a_mean, exp.group_b_mean);
                                                                const maxM = Math.max(exp.group_a_mean, exp.group_b_mean);
                                                                if (minM === 0) return 'N/A';
                                                                return `+${(((maxM - minM) / Math.abs(minM)) * 100).toFixed(1)}%`;
                                                            })()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                {/* Summary Cards bg-surface */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="mb-12 flex items-center gap-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Experiment Results</h3>
                                        <div className="h-px flex-1 bg-edge" />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {/* Winner */}
                                        <div className="bg-surface border border-edge rounded-[1.5rem] p-8 text-center">
                                            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-4" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Winner</p>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">
                                                {result.data.group_a_mean > result.data.group_b_mean
                                                    ? result.data.group_a_label
                                                    : result.data.group_b_label}
                                            </p>
                                        </div>

                                        {/* Improvement */}
                                        <div className="bg-surface border border-edge rounded-[1.5rem] p-8 text-center">
                                            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-4" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Improvement</p>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">
                                                {(() => {
                                                    const minMean = Math.min(result.data.group_a_mean, result.data.group_b_mean);
                                                    const maxMean = Math.max(result.data.group_a_mean, result.data.group_b_mean);
                                                    if (minMean === 0) return 'N/A';
                                                    return `${(((maxMean - minMean) / Math.abs(minMean)) * 100).toFixed(1)}%`;
                                                })()}
                                            </p>
                                        </div>

                                        {/* Confidence */}
                                        <div className="bg-surface border border-edge rounded-[1.5rem] p-8 text-center">
                                            <BarChart3 className="w-6 h-6 text-blue-500 mx-auto mb-4" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Confidence</p>
                                            <p className="text-2xl font-bold text-slate-900 tracking-tight">
                                                {(result.data.confidence * 100).toFixed(2)}%
                                            </p>
                                        </div>

                                        {/* Significant */}
                                        <div className={`border rounded-[1.5rem] p-8 text-center ${
                                            result.data.significant
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-amber-50 border-amber-200'
                                        }`}>
                                            <Info className={`w-6 h-6 mx-auto mb-4 ${
                                                result.data.significant ? 'text-green-500' : 'text-amber-500'
                                            }`} />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Significant</p>
                                            <p className={`text-2xl font-bold tracking-tight ${
                                                result.data.significant ? 'text-green-700' : 'text-amber-700'
                                            }`}>
                                                {result.data.significant ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Stats Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                >
                                    <div className="mb-12 flex items-center gap-4">
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Statistical Detail</h3>
                                        <div className="h-px flex-1 bg-edge" />
                                    </div>

                                    <div className="bg-surface border border-edge rounded-[2rem] overflow-hidden">
                                        <table className="w-full">
                                            <tbody className="divide-y divide-edge">
                                                <tr>
                                                    <td className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Group A ({result.data.group_a_label})</td>
                                                    <td className="px-8 py-5 text-right text-lg font-bold text-slate-900">Mean: {result.data.group_a_mean} <span className="text-slate-400 text-sm font-medium">· n={result.data.group_a_size}</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Group B ({result.data.group_b_label})</td>
                                                    <td className="px-8 py-5 text-right text-lg font-bold text-slate-900">Mean: {result.data.group_b_mean} <span className="text-slate-400 text-sm font-medium">· n={result.data.group_b_size}</span></td>
                                                </tr>
                                                <tr>
                                                    <td className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Test Type</td>
                                                    <td className="px-8 py-5 text-right text-lg font-bold text-slate-900 capitalize">{result.data.test_type}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">P-Value</td>
                                                    <td className="px-8 py-5 text-right text-lg font-bold text-slate-900">{result.data.p_value.toFixed(6)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400">Effect Size</td>
                                                    <td className="px-8 py-5 text-right text-lg font-bold text-slate-900">{result.data.effect_size}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>

                                {/* Warnings */}
                                {result.data.warnings.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-8">
                                            <div className="flex items-center gap-3 mb-4">
                                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600">Warnings</h4>
                                            </div>
                                            <ul className="space-y-3">
                                                {result.data.warnings.map((w, idx) => (
                                                    <li key={idx} className="text-base text-amber-800 font-medium pl-8 relative">
                                                        <div className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        )}

                        {/* Section 3: AI Explanation */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        >
                            <div className="mb-12 flex items-center gap-4">
                                <Brain className="w-4 h-4 text-glow-blue" />
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Section 3: AI Explanation</h3>
                                <div className="h-px flex-1 bg-edge" />
                            </div>

                            <div className="bg-surface border border-edge rounded-[2rem] p-12">
                                <p className="text-xl leading-relaxed text-slate-600 font-medium whitespace-pre-line">
                                    {result.insight}
                                </p>
                            </div>
                        </motion.div>

                        <div className="h-32" />
                    </div>
                )}
            </main>
        </div>
    );
};

export default ABTest;
