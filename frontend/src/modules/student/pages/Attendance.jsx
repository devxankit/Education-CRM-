import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../../theme/colors'; // Just in case, though we used centralized usually

// Components
import OverallAttendanceCard from '../components/Attendance/OverallAttendanceCard';
import EligibilityStatusCard from '../components/Attendance/EligibilityStatusCard';
import SubjectAttendanceList from '../components/Attendance/SubjectAttendanceList';
import MonthlyAttendanceView from '../components/Attendance/MonthlyAttendanceView';
import AttendanceHistory from '../components/Attendance/AttendanceHistory';
import InfoTooltip from '../components/Attendance/InfoTooltip';
import EmptyState from '../components/Attendance/EmptyState';

// Data
import { useStudentStore } from '../../../store/studentStore';

const AttendancePage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const data = useStudentStore(state => state.attendance);
    const [loading, setLoading] = useState(false);

    return (
        <div ref={containerRef} className="min-h-screen bg-white md:bg-gray-50 pb-24">
            {/* 1. Header (Sticky) */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h1 className="text-lg font-bold text-gray-900">Attendance</h1>

                    <InfoTooltip
                        content={
                            <div className="space-y-2">
                                <p><strong>Safe (&ge;75%):</strong> You are eligible for exams.</p>
                                <p><strong>Warning (70-74%):</strong> You need to attend more classes to be safe.</p>
                                <p><strong>Risk (&lt;70%):</strong> You are at risk of detainment. Contact administration.</p>
                            </div>
                        }
                    >
                        <button className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </InfoTooltip>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-sm text-gray-500 font-medium">Loading Attendance...</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.1 }
                                }
                            }}
                        >
                            {/* 2. Overall Card */}
                            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                                <OverallAttendanceCard attendance={data.overall} />
                            </motion.div>

                            {/* 3. Eligibility Status */}
                            <motion.div
                                className="mt-6"
                                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            >
                                <EligibilityStatusCard eligibility={data.eligibility} />
                            </motion.div>

                            {/* 4. Subject Breakdown */}
                            <motion.div
                                className="mt-8"
                                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            >
                                <SubjectAttendanceList subjects={data.subjects} />
                            </motion.div>

                            {/* 5. Monthly View */}
                            <motion.div
                                className="mt-8"
                                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            >
                                <MonthlyAttendanceView monthlyLog={data.monthlyLog} />
                            </motion.div>

                            {/* 6. History */}
                            <motion.div
                                className="mt-8 mb-12"
                                variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                            >
                                <AttendanceHistory history={data.history} />
                            </motion.div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AttendancePage;
