import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../../../theme/colors';
import gsap from 'gsap';

const SubjectAttendanceRow = ({ subject, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const progressRef = useRef(null);
    const rowRef = useRef(null);

    const { name, teacher, percentage, present, total, status, riskLevel } = subject;

    const getStatusColor = (pct) => {
        if (pct >= 75) return colors.success;
        if (pct >= 70) return colors.warning;
        return colors.error;
    };

    const color = getStatusColor(percentage);

    // Initial Animation
    useEffect(() => {
        gsap.fromTo(progressRef.current,
            { width: "0%" },
            { width: `${percentage}%`, duration: 1, ease: "power2.out", delay: 0.1 + (index * 0.1) }
        );

        gsap.fromTo(rowRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
        );
    }, [percentage, index]);

    return (
        <div ref={rowRef} className="border-b border-gray-100 last:border-0">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="py-4 px-4 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer"
            >
                {/* Left: Info */}
                <div className="flex-1 pr-4">
                    <h4 className="text-gray-900 font-medium text-sm sm:text-base">{name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{teacher}</p>
                </div>

                {/* Right: Stats */}
                <div className="flex items-center gap-3">
                    <div className="text-right w-16">
                        <div className="text-sm font-bold" style={{ color: color }}>
                            {percentage}%
                        </div>
                        {percentage < 75 && (
                            <div className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
                                Risk
                            </div>
                        )}
                    </div>

                    {/* Expand Arrow */}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </div>
            </div>

            {/* Progress Bar (Visible Always but subtle) */}
            <div className="h-1 w-full bg-gray-100 mt-[-1px]">
                <div
                    ref={progressRef}
                    className="h-full rounded-r-full"
                    style={{ backgroundColor: color }}
                ></div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-gray-50"
                    >
                        <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white p-3 rounded-lg border border-gray-100 text-center shadow-sm">
                                <span className="block text-gray-400 text-xs uppercase tracking-wide">Present</span>
                                <span className="font-bold text-gray-900 text-lg">{present}</span>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-100 text-center shadow-sm">
                                <span className="block text-gray-400 text-xs uppercase tracking-wide">Total Classes</span>
                                <span className="font-bold text-gray-900 text-lg">{total}</span>
                            </div>
                            <div className="col-span-2 text-xs text-center text-gray-500">
                                {riskLevel === 'high'
                                    ? "⚠️ Critical Alert: Please meet the class teacher immediately."
                                    : "Keep attending to improve your score."}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubjectAttendanceRow;
