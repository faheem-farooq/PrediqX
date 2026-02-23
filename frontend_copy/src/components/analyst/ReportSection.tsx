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
        <div className={`bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden mb-6 ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-slate-100">{title}</h3>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-6 border-t border-slate-800">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReportSection;
