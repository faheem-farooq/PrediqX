import React from 'react';
import Navbar from '../layouts/Navbar';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            <Navbar />
            <main>
                <Hero />
                <Features />
            </main>
            <footer className="py-20 text-center text-slate-400 text-xs border-t border-edge max-w-7xl mx-auto">
                &copy; {new Date().getFullYear()} PREDIQX Intelligence. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;
