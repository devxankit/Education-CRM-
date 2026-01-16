import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../../../theme/colors';

const InfoTooltip = ({ content, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block" ref={tooltipRef}>
            <div onClick={() => setIsVisible(!isVisible)} className="cursor-pointer">
                {children}
            </div>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-8 z-50 w-64 p-4 text-sm bg-white rounded-xl shadow-xl border border-gray-100 text-gray-700 pointer-events-none"
                        style={{ pointerEvents: 'auto' }} // Enable interaction within tooltip
                    >
                        <div className="font-semibold mb-1 text-gray-900">Information</div>
                        {content}
                        <div className="absolute -top-2 right-2 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InfoTooltip;
