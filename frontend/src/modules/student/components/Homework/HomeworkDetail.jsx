import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Download, FileText, Lock, Clock } from 'lucide-react';
import HomeworkSubmission from './HomeworkSubmission';

const HomeworkDetail = ({ homework, onClose, onRefresh }) => {
    if (!homework) return null;

    const isPending = homework.status === 'Pending' || homework.status === 'Overdue';
    const isSubmitted = ['Submitted', 'Checked', 'Graded', 'Late'].includes(homework.status);
    const isOverdue = homework.status === 'Overdue';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{homework.subject}</h2>
                        <p className="text-xs text-gray-500">Task Details</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Metadata Pill */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1">
                            <Calendar size={12} /> Assigned: {new Date(homework.assignedDate).toLocaleDateString()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                            <Clock size={12} /> Due: {new Date(homework.dueDate).toLocaleDateString()} {new Date(homework.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{homework.title}</h1>

                    {/* Instructions */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Instructions</h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{homework.instructions}</p>
                    </div>

                    {/* Attachments */}
                    {homework.attachments && homework.attachments.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Resources</h4>
                            {homework.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{file.name}</p>
                                            <p className="text-[10px] text-gray-400">{file.size}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Logic Branching */}
                    {isSubmitted ? (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-900 mb-3">Your Submission</h4>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <p className="text-xs text-gray-500 mb-2">Submitted on {new Date(homework.submission.date).toLocaleString()}</p>
                                {homework.submission.files.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm font-medium text-gray-800 bg-white p-2 rounded border border-gray-100">
                                        <FileText size={14} className="text-gray-400" />
                                        {file.name}
                                    </div>
                                ))}
                            </div>

                            {/* Feedback Section */}
                            {(homework.status === 'Checked' || homework.status === 'Graded') && homework.feedback && (
                                <div className="mt-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="text-xs font-bold text-emerald-800 uppercase">Teacher Feedback</h5>
                                        <span className="text-sm font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-sm">
                                            Score: {homework.feedback.marks}/{homework.feedback.maxMarks}
                                        </span>
                                    </div>
                                    <p className="text-sm text-emerald-900 italic">"{homework.feedback.remarks}"</p>
                                </div>
                            )}
                        </div>
                    ) : isOverdue ? (
                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Submission Closed</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                                The due date for this assignment has passed. Please contact your teacher for assistance.
                            </p>
                        </div>
                    ) : (
                        <HomeworkSubmission
                            homework={homework}
                            onSubmissionComplete={() => {
                                // In a real app, this would refresh data
                                onRefresh && onRefresh();
                                onClose();
                            }}
                        />
                    )}

                </div>
            </motion.div>
        </motion.div>
    );
};

export default HomeworkDetail;
