import React, { useEffect, useState } from 'react';
import Navbar from '../layouts/Navbar';
import { Activity, Database, CheckCircle, Zap, Loader2, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import { getEDA } from '../services/api';
import Histogram from '../components/charts/Histogram';
import BarChart from '../components/charts/BarChart';
import CorrelationHeatmap from '../components/charts/CorrelationHeatmap';
import Boxplot from '../components/charts/Boxplot';

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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
                    <p className="text-slate-400 mt-2">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20">
            <Navbar />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Dashboard (EDA)</h1>
                        <p className="text-slate-400 mt-1">
                            {stats ? "Comprehensive analysis of your uploaded dataset." : "Overview of your business metrics (Demo Mode)."}
                        </p>
                    </div>
                    <div className="text-sm text-slate-500">
                        {localStorage.getItem("currentFileName") || "No file selected"}
                    </div>
                </div>

                {/* Enhanced Overview Stats Grid */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                        Dataset Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Rows */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Total Rows</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats?.dataset_overview?.rows?.toLocaleString() ?? "0"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Dataset Size</p>
                                </div>
                                <Database className="text-blue-400 h-12 w-12 opacity-80" />
                            </div>
                        </Card>

                        {/* Total Columns */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Total Features</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats?.dataset_overview?.columns ?? "0"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Column Count</p>
                                </div>
                                <Activity className="text-purple-400 h-12 w-12 opacity-80" />
                            </div>
                        </Card>

                        {/* Numerical Features */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Numerical</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats?.dataset_overview?.numerical_features ?? "0"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Numeric Columns</p>
                                </div>
                                <Zap className="text-green-400 h-12 w-12 opacity-80" />
                            </div>
                        </Card>

                        {/* Categorical Features */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Categorical</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats?.dataset_overview?.categorical_features ?? "0"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Text Columns</p>
                                </div>
                                <CheckCircle className="text-pink-400 h-12 w-12 opacity-80" />
                            </div>
                        </Card>

                        {/* Missing Values */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Missing Values</p>
                                    <p className="text-3xl font-bold text-white">
                                        {stats?.dataset_overview?.missing_values
                                            ? (Object.values(stats.dataset_overview.missing_values) as number[]).reduce((a: number, b: number) => a + b, 0)
                                            : "0"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Total Cells</p>
                                </div>
                                <AlertCircle className="text-orange-400 h-12 w-12 opacity-80" />
                            </div>
                        </Card>

                        {/* Target Column */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm mb-1">Target Column</p>
                                    <p className="text-xl font-bold text-white truncate">
                                        {stats?.dataset_overview?.target_column || "Not Detected"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">Classification</p>
                                </div>
                                <Activity className="text-cyan-400 h-12 w-12 opacity-80" />
                            </div>
                        </Card>

                        {/* Imbalance Ratio */}
                        {stats?.dataset_overview?.imbalance_ratio && (
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">Class Imbalance</p>
                                        <p className="text-3xl font-bold text-white">
                                            {stats.dataset_overview.imbalance_ratio}%
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {stats.dataset_overview.imbalance_ratio > 65 ? (
                                                <span className="text-red-400">⚠️ Imbalanced</span>
                                            ) : (
                                                <span className="text-green-400">✓ Balanced</span>
                                            )}
                                        </p>
                                    </div>
                                    <AlertCircle className={stats.dataset_overview.imbalance_ratio > 65 ? "text-red-400 h-12 w-12 opacity-80" : "text-green-400 h-12 w-12 opacity-80"} />
                                </div>
                            </Card>
                        )}
                    </div>
                </section>

                {!stats && (
                    <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                        <p className="text-slate-400">No data found. Please upload a CSV file to view analysis.</p>
                    </div>
                )}

                {stats && (
                    <>
                        {/* Numerical Feature Analysis Section */}
                        {stats.numerical_analysis && stats.numerical_analysis.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                                    Numerical Feature Analysis
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {stats.numerical_analysis.map((feature: any, idx: number) => (
                                        <Card key={idx} className="min-h-[600px] p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">
                                                {feature.feature}
                                            </h3>

                                            {/* Statistics Grid */}
                                            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Mean</p>
                                                    <p className="text-white font-semibold">{feature.mean?.toFixed(2) ?? 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Median</p>
                                                    <p className="text-white font-semibold">{feature.median?.toFixed(2) ?? 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Std Dev</p>
                                                    <p className="text-white font-semibold">{feature.std_dev?.toFixed(2) ?? 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Skewness</p>
                                                    <p className="text-white font-semibold">{feature.skewness?.toFixed(3) ?? 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Min</p>
                                                    <p className="text-white font-semibold">{feature.min?.toFixed(2) ?? 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Max</p>
                                                    <p className="text-white font-semibold">{feature.max?.toFixed(2) ?? 'N/A'}</p>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded col-span-2">
                                                    <p className="text-slate-400">Outliers Detected (IQR Method)</p>
                                                    <p className="text-white font-semibold">
                                                        {feature.outlier_count ?? 0}
                                                        <span className="text-xs text-slate-500 ml-2">
                                                            ({((feature.outlier_count ?? 0) / (stats.dataset_overview?.rows || 1) * 100).toFixed(1)}%)
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Histogram */}
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-slate-300 mb-2">Distribution (Histogram)</p>
                                                <div className="h-48">
                                                    <Histogram
                                                        bins={feature.histogram_bins}
                                                        counts={feature.histogram_counts}
                                                        title=""
                                                        color="#a78bfa"
                                                    />
                                                </div>
                                            </div>

                                            {/* Boxplot */}
                                            {feature.boxplot && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-slate-300 mb-2">Boxplot (Quartiles & Outliers)</p>
                                                    <div className="flex justify-center">
                                                        <Boxplot data={feature.boxplot} width={300} height={180} />
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Categorical Feature Analysis Section */}
                        {stats.categorical_analysis && stats.categorical_analysis.length > 0 && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                                    Categorical Feature Analysis
                                </h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {stats.categorical_analysis.map((feature: any, idx: number) => (
                                        <Card key={idx} className="min-h-[400px] p-6">
                                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">
                                                {feature.feature}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Unique Values</p>
                                                    <p className="text-white font-semibold">{feature.unique_count}</p>
                                                </div>
                                                <div className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400">Most Frequent</p>
                                                    <p className="text-white font-semibold truncate">{feature.most_frequent || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="h-64">
                                                <BarChart
                                                    data={feature.value_counts}
                                                    title="Distribution"
                                                    color="#f472b6"
                                                    showPercentages={true}
                                                    percentages={feature.value_percentages}
                                                />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Target Distribution Section */}
                        {stats.target_distribution && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                                    Target Variable Analysis
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <Card className="min-h-[450px] p-6">
                                        <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {stats.target_distribution.target_column || 'Class Distribution'}
                                            </h3>
                                            {stats.target_distribution.is_imbalanced && (
                                                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/30">
                                                    ⚠️ Imbalanced ({stats.target_distribution.imbalance_ratio}%)
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
                                            {stats.target_distribution.percentages && Object.entries(stats.target_distribution.percentages).slice(0, 3).map(([key, value]: [string, any]) => (
                                                <div key={key} className="bg-slate-900/50 p-3 rounded">
                                                    <p className="text-slate-400 truncate">{key}</p>
                                                    <p className="text-white font-semibold">{value}%</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-80">
                                            <BarChart
                                                data={stats.target_distribution.distribution}
                                                title="Class Frequency"
                                                color="#14b8a6"
                                                showPercentages={true}
                                                percentages={stats.target_distribution.percentages}
                                            />
                                        </div>
                                    </Card>
                                </div>
                            </section>
                        )}

                        {/* Correlation Analysis Section */}
                        {stats.correlation_matrix && (
                            <section className="mb-12">
                                <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                                    Correlation Analysis
                                </h2>

                                {/* Correlation Heatmap */}
                                <Card className="p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-4">Feature Correlation Matrix</h3>
                                    <div className="h-[500px]">
                                        <CorrelationHeatmap
                                            data={stats.correlation_matrix}
                                            title=""
                                        />
                                    </div>
                                </Card>

                                {/* Top Correlations */}
                                {stats.correlation_matrix.top_correlations && stats.correlation_matrix.top_correlations.length > 0 && (
                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Top 3 Strongest Correlations</h3>
                                        <div className="space-y-3">
                                            {stats.correlation_matrix.top_correlations.map((corr: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-2xl font-bold text-purple-400">#{idx + 1}</span>
                                                        <div>
                                                            <p className="text-white font-medium">
                                                                {corr.feature1} <span className="text-slate-500">↔</span> {corr.feature2}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {corr.correlation > 0 ? 'Positive' : 'Negative'} correlation
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-2xl font-bold ${Math.abs(corr.correlation) > 0.7 ? 'text-red-400' :
                                                            Math.abs(corr.correlation) > 0.4 ? 'text-yellow-400' :
                                                                'text-green-400'
                                                            }`}>
                                                            {corr.correlation.toFixed(3)}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {Math.abs(corr.correlation) > 0.7 ? 'Strong' :
                                                                Math.abs(corr.correlation) > 0.4 ? 'Moderate' : 'Weak'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
