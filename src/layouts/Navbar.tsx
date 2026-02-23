import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-edge transition-all duration-300">
            <div className="container mx-auto px-10 h-24 flex items-center justify-between max-w-7xl">
                {/* Logo - Left */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="inline-block font-extrabold text-2xl text-slate-900 tracking-tighter">
                            PREDIQ<span className="text-glow-blue group-hover:text-glow-violet transition-colors duration-300">X</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation Links - Centered */}
                <nav className="hidden md:flex flex-1 justify-center">
                    <div className="flex gap-12">
                        <Link to="/about" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors duration-300">
                            About
                        </Link>
                        <Link to="/upload" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors duration-300">
                            Upload
                        </Link>
                        <Link to="/analyst" className="text-xs font-bold uppercase tracking-widest text-glow-blue hover:text-glow-violet transition-colors duration-300">
                            Analyst
                        </Link>
                        <Link to="/dashboard" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors duration-300">
                            Dashboard
                        </Link>
                    </div>
                </nav>

                {/* CTA Buttons - Right */}
                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="hidden sm:inline-flex text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors duration-300">
                        Log in
                    </Link>
                    <Button size="sm" className="bg-black text-white hover:bg-slate-800 rounded-full px-8 font-bold uppercase tracking-widest text-[10px]">
                        Get Started
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
