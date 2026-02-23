import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Hero: React.FC = () => {
    return (
        <section className="relative bg-white pt-48 pb-32 flex flex-col items-center text-center">
            <div className="container relative z-10 mx-auto px-10 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                >
                    <h1 className="text-hero mb-12 text-slate-900 tracking-tighter">
                        AI-Powered Business <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-glow-blue to-glow-violet italic pr-2">Intelligence</span>
                        Engine.
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
                    className="text-2xl text-slate-500 mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
                >
                    Transform raw datasets into executive strategy with precision. Guided by the principles of calm, autonomous intelligence.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Button size="lg" className="bg-black text-white rounded-full px-12 transition-transform hover:scale-105 active:scale-95">
                        Get Started
                    </Button>
                    <Button size="lg" className="bg-surface text-slate-600 hover:text-slate-900 rounded-full px-12 border-none">
                        Documentation
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
