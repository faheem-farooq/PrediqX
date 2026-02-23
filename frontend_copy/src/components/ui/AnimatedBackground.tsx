import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden -z-10 bg-slate-900">
            {/* Abstract gradient orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
            />

            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-violet-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"
            />

            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
        </div>
    );
};

export default AnimatedBackground;
