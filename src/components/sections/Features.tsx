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
        <section className="bg-surface py-48 relative overflow-hidden">
            <div className="container mx-auto px-10 max-w-7xl">
                <div className="text-center mb-32">
                    <h2 className="text-5xl font-bold text-slate-900 mb-8 tracking-tighter">
                        Architected for Excellence.
                    </h2>
                    <p className="text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        A suite of high-performance capabilities refined for executive analysis and autonomous discovery.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-12 rounded-[2.5rem] bg-white border border-edge/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                            <div className="w-16 h-16 rounded-3xl bg-surface flex items-center justify-center text-3xl mb-10 group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">{feature.title}</h3>
                            <p className="text-lg text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
