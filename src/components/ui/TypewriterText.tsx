import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
    text: string;
    speed?: number;
    className?: string;
    onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    speed = 50,
    className = '',
    onComplete
}) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i === text.length) {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed, onComplete]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {displayedText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-[3px] h-[1em] bg-blue-400 ml-1 align-middle"
            />
        </motion.span>
    );
};

export default TypewriterText;
