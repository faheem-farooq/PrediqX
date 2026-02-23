import React from 'react';
import Navbar from '../layouts/Navbar';
import Card from '../components/ui/Card';
import { CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 pb-20">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">About PrediqX</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Empowering businesses with AI-driven insights. Turn your raw data into actionable strategies.
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">Our Mission</h2>
                        <div className="prose prose-invert max-w-none text-slate-300">
                            <p className="mb-4">
                                In today's fast-paced digital economy, data is the most valuable asset a company possesses. However, raw data alone isn't enough. Organizations struggle to bridge the gap between data collection and meaningful decision-making.
                            </p>
                            <p>
                                PrediqX was built to solve this problem. We democratize access to advanced machine learning algorithms, allowing business users—not just data scientists—to forecast trends, identify risks, and uncover hidden opportunities within their datasets.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-6">Key Use Cases</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle2 className="text-blue-500 mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Customer Churn Prediction</h3>
                                        <p className="text-sm text-slate-400">Identify customers at risk of leaving and take proactive retention measures.</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle2 className="text-violet-500 mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Sales Forecasting</h3>
                                        <p className="text-sm text-slate-400">Predict future revenue based on historical data and market trends.</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle2 className="text-indigo-500 mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Inventory Management</h3>
                                        <p className="text-sm text-slate-400">Optimize stock levels by predicting demand fluctuations.</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle2 className="text-cyan-500 mt-1 shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">Marketing ROI Analysis</h3>
                                        <p className="text-sm text-slate-400">Measure the effectiveness of campaigns and allocate budget efficiently.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default About;
