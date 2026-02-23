import React from 'react';
import Navbar from '../layouts/Navbar';
import { CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 pb-48 transition-colors duration-500">
            <Navbar />

            <main className="container mx-auto px-10 pt-48 max-w-7xl">
                {/* Header Section - Editorial */}
                <div className="mb-32 flex flex-col items-center text-center border-b border-edge pb-24">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 mb-8">
                        The PrediqX Mission
                    </span>
                    <h1 className="text-7xl md:text-8xl font-bold text-slate-900 tracking-tighter leading-none mb-10">
                        Intelligent <span className="text-glow-blue italic">Clarity</span>.
                    </h1>
                    <p className="text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
                        Empowering organizations to bridge the gap between complex data collection and meaningful executive decision-making.
                    </p>
                </div>

                <div className="space-y-48">
                    {/* Mission Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        <div className="lg:col-span-4 sticky top-48">
                            <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Our Purpose</h2>
                            <div className="h-px w-24 bg-glow-blue mt-6" />
                        </div>
                        <div className="lg:col-span-8 text-2xl leading-relaxed text-slate-500 font-medium space-y-10">
                            <p>
                                In today's accelerated digital landscape, information is abundant but insight remains rare. Organizations often drown in data while starving for knowledge. We believe that raw signals alone are insufficient for leadership.
                            </p>
                            <p>
                                PrediqX was architected to dismantle this barrier. We provide a bridge for non-technical stakeholders to access the power of elite machine learning, turning passive datasets into active strategic accelerators.
                            </p>
                        </div>
                    </section>

                    {/* Use Cases Section */}
                    <section>
                        <div className="flex items-center gap-8 mb-24">
                            <h2 className="text-4xl font-bold text-slate-900 tracking-tighter uppercase leading-none">Operational Signals</h2>
                            <div className="h-px flex-1 bg-edge" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="group bg-surface p-12 rounded-[3.5rem] border border-edge transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
                                <div className="w-16 h-16 bg-white rounded-2xl border border-edge flex items-center justify-center text-slate-900 mb-10 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tighter mb-6">Customer Pulse</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Identify behavioral shifts and churn risks before they impact the bottom line.
                                </p>
                            </div>

                            <div className="group bg-surface p-12 rounded-[3.5rem] border border-edge transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
                                <div className="w-16 h-16 bg-white rounded-2xl border border-edge flex items-center justify-center text-slate-900 mb-10 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tighter mb-6">Revenue Projection</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Model future growth trajectories with high-fidelity historical synthesis.
                                </p>
                            </div>

                            <div className="group bg-surface p-12 rounded-[3.5rem] border border-edge transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
                                <div className="w-16 h-16 bg-white rounded-2xl border border-edge flex items-center justify-center text-slate-900 mb-10 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tighter mb-6">Supply Precision</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Optimize logistical flow and inventory levels through predictive demand mapping.
                                </p>
                            </div>

                            <div className="group bg-surface p-12 rounded-[3.5rem] border border-edge transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50">
                                <div className="w-16 h-16 bg-white rounded-2xl border border-edge flex items-center justify-center text-slate-900 mb-10 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 tracking-tighter mb-6">Marketing Fidelity</h3>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Quantify campaign resonance and focus capital on high-yield conversion signals.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default About;
