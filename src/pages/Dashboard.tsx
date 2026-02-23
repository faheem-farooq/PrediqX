import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { Activity, Database, Zap, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { getEDA } from '../services/api';
import Histogram from '../components/charts/Histogram';
import BarChart from '../components/charts/BarChart';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';
import Boxplot from '../components/charts/Boxplot';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fileId = localStorage.getItem("currentFileId");
        if (!fileId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const data = await getEDA(fileId);
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch EDA:", err);
                setError("Failed to load analysis data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-900">
                <div className="h-1 w-48 bg-slate-100 rounded-full overflow-hidden relative mb-8">
                    <motion.div
                        className="absolute top-0 left-0 h-full bg-black"
                        animate={{ x: [-192, 192] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Loading Intelligence...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white font-sans text-slate-900 pb-20">
                <Navbar />
                <div className="container mx-auto px-10 py-48 text-center max-w-4xl">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-red-100">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                    <h2 className="text-4xl font-bold tracking-tighter mb-4">Discovery Error</h2>
                    <p className="text-slate-500 text-xl font-medium mb-12">{error}</p>
                    <Button onClick={() => window.location.reload()} variant="primary" size="lg">
                        Retry Retrieval
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-48 transition-colors duration-500">
            <Navbar />

            <main className="container mx-auto px-10 pt-48 max-w-7xl">
                {/* Header Section - Editorial */}
                <div className="mb-32 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-edge pb-16">
                    <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-6">
                            Executive View — Phase 02
                        </span>
                        <h1 className="text-6xl font-bold text-slate-900 tracking-tighter leading-none mb-6">
                            Analytical <span className="text-glow-blue italic">Pulse</span>.
                        </h1>
                        <p className="text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                            A high-resolution synthesis of core data attributes and system-wide patterns.
                        </p>
                    </div>
                    <div className="px-6 py-3 bg-surface rounded-full border border-edge text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Source: {localStorage.getItem("currentFileName") || "External Protocol"}
                    </div>
                </div>

                {/* Dataset Overview - Minimalist Metrics */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                    className="mb-32"
                >
                    <div className="flex items-center gap-6 mb-16">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Section 01</h2>
                        <div className="h-px flex-1 bg-edge" />
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Dimensional Overview</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Total Rows */}
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-6">
                                <Database className="h-3 w-3" /> Entire Entries
                            </p>
                            <p className="text-5xl font-bold text-slate-900 tabular-nums tracking-tighter leading-none">
                                {stats?.dataset_overview?.rows?.toLocaleString() ?? "0"}
                            </p>
                        </div>

                        {/* Total Columns */}
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-6">
                                <Activity className="h-3 w-3" /> Core Dimensions
                            </p>
                            <p className="text-5xl font-bold text-slate-900 tabular-nums tracking-tighter leading-none">
                                {stats?.dataset_overview?.columns ?? "0"}
                            </p>
                        </div>

                        {/* Missing Values */}
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-6">
                                <AlertCircle className="h-3 w-3" /> Null Exceptions
                            </p>
                            <p className={`text-5xl font-bold tabular-nums tracking-tighter leading-none ${stats?.dataset_overview?.missing_values && (Object.values(stats.dataset_overview.missing_values) as number[]).reduce((a: number, b: number) => a + b, 0) > 0 ? 'text-red-500' : 'text-slate-900'}`}>
                                {stats?.dataset_overview?.missing_values
                                    ? (Object.values(stats.dataset_overview.missing_values) as number[]).reduce((a: number, b: number) => a + b, 0)
                                    : "0"}
                            </p>
                        </div>

                        {/* Numerical Features */}
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-6">
                                <Zap className="h-3 w-3" /> Active Signals
                            </p>
                            <p className="text-5xl font-bold text-slate-900 tabular-nums tracking-tighter leading-none text-glow-blue">
                                {stats?.dataset_overview?.numerical_features ?? "0"}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {!stats && (
                    <div className="text-center py-48 bg-surface/30 rounded-[3rem] border border-dashed border-edge mb-32">
                        <p className="text-slate-400 text-xl font-medium">No active intelligence detected. Please initialize a dataset to begin discovery.</p>
                    </div>
                )}

                {stats && (
                    <>
                        {/* Numerical Feature Analysis Section */}
                        {stats.numerical_analysis && stats.numerical_analysis.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                className="mb-48"
                            >
                                <div className="flex items-center gap-8 mb-24">
                                    <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Numerical Patterns</h2>
                                    <div className="h-px flex-1 bg-edge" />
                                </div>

                                <div className="space-y-48">
                                    {stats.numerical_analysis.map((feature: any, idx: number) => (
                                        <div key={idx} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start border-b border-edge pb-32 last:border-0">
                                            {/* Feature Info - Left */}
                                            <div className="lg:col-span-4 sticky top-48">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-glow-blue mb-6 block">Statistical Core</span>
                                                <h3 className="text-4xl font-bold text-slate-900 mb-10 tracking-tighter">
                                                    {feature.feature}
                                                </h3>

                                                <div className="space-y-12">
                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Mean</p>
                                                            <p className="text-3xl font-bold text-slate-900 tabular-nums">{feature.mean?.toFixed(2) ?? '—'}</p>
                                                        </div>
                                                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">Median</p>
                                                            <p className="text-3xl font-bold text-slate-900 tabular-nums">{feature.median?.toFixed(2) ?? '—'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Standard Deviation</p>
                                                        <p className="text-2xl font-bold text-slate-900">{feature.std_dev?.toFixed(2) ?? '—'}</p>
                                                        <div className="mt-8 pt-8 border-t border-slate-200 flex justify-between items-center">
                                                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Anomaly Count</span>
                                                            <span className={`text-2xl font-bold tabular-nums ${feature.outlier_count > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                                {feature.outlier_count ?? 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Charts - Right */}
                                            <div className="lg:col-span-8 space-y-16">
                                                <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100">
                                                    <div className="h-[400px]">
                                                        <Histogram
                                                            bins={feature.histogram_bins}
                                                            counts={feature.histogram_counts}
                                                            title=""
                                                            color="#000000"
                                                        />
                                                    </div>
                                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-12 text-center italic">Frequency Distribution Profile</p>
                                                </div>

                                                {feature.boxplot && (
                                                    <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100">
                                                        <div className="flex justify-center">
                                                            <Boxplot data={feature.boxplot} width={500} height={180} title="" />
                                                        </div>
                                                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-12 text-center italic">Quintile Variance Projection</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Categorical Feature Analysis Section */}
                        {stats.categorical_analysis && stats.categorical_analysis.length > 0 && (
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                                className="mb-48"
                            >
                                <div className="flex items-center gap-8 mb-24">
                                    <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Categorical Tiers</h2>
                                    <div className="h-px flex-1 bg-edge" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                    {stats.categorical_analysis.map((feature: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50">
                                            <div className="flex justify-between items-start mb-16">
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3 block">Structural Integrity</span>
                                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tighter">
                                                        {feature.feature}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Dominant Node</p>
                                                    <p className="text-lg font-bold text-slate-900 truncate max-w-[150px]">{feature.most_frequent || '—'}</p>
                                                </div>
                                            </div>

                                            <div className="h-80 mb-12">
                                                <BarChart
                                                    data={feature.value_counts}
                                                    title=""
                                                    color="#2563eb"
                                                    showPercentages={true}
                                                    percentages={feature.value_percentages}
                                                />
                                            </div>

                                            <div className="pt-10 border-t border-slate-200 flex justify-between">
                                                <div className="text-center flex-1 border-r border-slate-200">
                                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Unique Nodes</p>
                                                    <p className="text-3xl font-bold text-slate-900 tabular-nums">{feature.unique_count}</p>
                                                </div>
                                                <div className="text-center flex-1">
                                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Density Score</p>
                                                    <p className="text-3xl font-bold text-emerald-500 tabular-nums">1.0</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Correlation Section */}
                        {stats.correlation_matrix && (
                            <motion.section
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                                className="mb-48"
                            >
                                <div className="flex items-center gap-8 mb-24">
                                    <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Signal Correlations</h2>
                                    <div className="h-px flex-1 bg-edge" />
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-20 bg-slate-50 p-16 rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="xl:col-span-8">
                                        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/20 h-full">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-12 tracking-tight">Feature Dependency Map</h3>
                                            <div className="h-[550px]">
                                                <CorrelationHeatmap
                                                    data={stats.correlation_matrix}
                                                    title=""
                                                />
                                            </div>
                                            <p className="text-center text-slate-400 text-[10px] uppercase font-bold tracking-[0.3em] mt-12 italic">
                                                Pearson Correlation Coefficiency Matrix
                                            </p>
                                        </div>
                                    </div>
                                    <div className="xl:col-span-4 flex flex-col justify-center space-y-16">
                                        <div>
                                            <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tighter">Influence Clusters</h3>
                                            <p className="text-slate-500 font-medium leading-relaxed">Relationships identified with high statistical significance across numerical signals.</p>
                                        </div>

                                        <div className="space-y-10">
                                            {stats.correlation_matrix.top_correlations?.slice(0, 4).map((corr: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50"
                                                >
                                                    <div className="flex justify-between items-center mb-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-black group-hover:text-white transition-colors">
                                                                0{idx + 1}
                                                            </div>
                                                            <div>
                                                                <p className="text-slate-900 font-bold text-sm leading-tight mb-1">
                                                                    {corr.feature1}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                                    {corr.feature2}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <p className={`text-3xl font-bold tabular-nums ${Math.abs(corr.correlation) > 0.7 ? 'text-glow-blue' : 'text-slate-900'}`}>
                                                            {corr.correlation.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full bg-black transition-all duration-1000"
                                                            style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
