import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <div className="flex gap-6 md:gap-10">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold text-xl text-white tracking-tight">Prediq<span className="text-blue-500">X</span></span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link to="/about" className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            About
                        </Link>
                        <Link to="/upload" className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Upload
                        </Link>
                        <Link to="/analyst" className="flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                            Analyst
                        </Link>
                        <Link to="/dashboard" className="flex items-center text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                            Log in
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white border-none">
                            Get Started
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
