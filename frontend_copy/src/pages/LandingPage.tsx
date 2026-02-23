import React from 'react';
import Navbar from '../layouts/Navbar';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            <Navbar />
            <main>
                <Hero />
                <Features />
            </main>
            <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-800">
                &copy; {new Date().getFullYear()} PrediqX. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
