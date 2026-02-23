import React, { useState } from 'react';
import { ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportSectionProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({
    title,
    icon: Icon,
    children,
    defaultOpen = true,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`mb-12 ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-6 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
            >
                <div className="flex items-center space-x-4">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                        <Icon className="w-5 h-5 text-slate-300 group-hover:text-glow-blue transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isOpen ? 'Collapse' : 'Expand'}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="py-8 text-slate-400 leading-relaxed text-[15px]">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReportSection;
