import React from 'react';

interface Feature {
    title: string;
    description: string;
    icon?: string;
}

const features: Feature[] = [
    {
        title: "Automated Analysis",
        description: "Upload your CSV and let our algorithms automatically clean and analyze your data.",
        icon: "📊",
    },
    {
        title: "Predictive Insights",
        description: "Use advanced regression and classification models to forecast future trends.",
        icon: "🔮",
    },
    {
        title: "Secure Processing",
        description: "Your data is processed locally and securely. We prioritize privacy.",
        icon: "🔒",
    },
];

const Features: React.FC = () => {
    return (
        <section className="bg-slate-900 py-12 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Why Choose PrediqX?
                    </h2>
                    <p className="text-lg text-slate-400">
                        Turn raw data into actionable business intelligence.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 transition-all hover:shadow-xl hover:bg-slate-750">
                            <div className="text-4xl mb-4 grayscale opacity-80">{feature.icon}</div>
                            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-slate-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
