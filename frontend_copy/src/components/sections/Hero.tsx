import React from 'react';
import Button from '../ui/Button';

const Hero: React.FC = () => {
    return (
        <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                Prediq<span className="text-blue-500">X</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl">
                Machine Learning–Driven Business Decision Support System.
                Upload your data and let intelligence guide your decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                    Get Started
                </Button>
                <Button variant="outline" size="lg">
                    Learn More
                </Button>
            </div>
        </section>
    );
};

export default Hero;
