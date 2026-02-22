
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Calendar, User, Download, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParentStore } from '../../../store/parentStore';

const HomeworkDetailPage = () => {
    const { homeworkId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const homeworkList = useParentStore(state => state.homework);

    const homework = homeworkList?.find(h => {
        const hid = h._id || h.id;
        return hid?.toString() === homeworkId || hid === homeworkId;
    });

    if (!homework) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="text-gray-400" size={32} />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Homework Not Found</h2>
            <p className="text-sm text-gray-500 mt-2">The selected assignment could not be loaded or has been removed.</p>
            <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm">Go Back</button>
        </div>
    );

    const getStatusTheme = (status) => {
        switch (status) {
            case 'Submitted': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle };
            case 'Late': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertTriangle };
            default: return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock };
        }
    };

    const theme = getStatusTheme(homework.status);
    const StatusIcon = theme.icon;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeft size={22} className="text-gray-600" />
                </button>
                <h1 className="text-lg font-bold text-gray-900 truncate pr-4">{homework.title}</h1>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-5">

                {/* Status Card */}
                <div className={`rounded-xl p-4 border ${theme.bg} ${theme.border} flex items-start gap-3`}>
                    <StatusIcon className={`${theme.text} mt-0.5`} size={20} />
                    <div>
                        <span className={`block text-xs font-bold uppercase tracking-wider mb-0.5 ${theme.text}`}>Status: {homework.status}</span>
                        <p className={`text-xs font-medium ${theme.text} opacity-90`}>
                            {homework.status === 'Submitted'
                                ? 'Assignment turned in on time.'
                                : homework.status === 'Late'
                                    ? 'The due date has passed.'
                                    : `Due on ${homework.dueDate ? new Date(homework.dueDate).toLocaleDateString() : 'N/A'}`
                            }
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Subject</span>
                            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{homework.subject}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Teacher</span>
                            <div className="flex items-center gap-1.5 justify-end">
                                <User size={14} className="text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">{homework.teacher}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="text-xs text-gray-400 font-bold uppercase block mb-2">Instructions</span>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {homework.description}
                        </p>
                    </div>

                    {/* Submit Button Placeholder (Visual only, disabled) */}
                    {/* Parent cannot submit. We show nothing or a subtle text. */}
                </div>

                {/* Attachments */}
                {homework.attachments && homework.attachments.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Attachments</h3>
                        {homework.attachments.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{file.name}</p>
                                        <p className="text-[10px] text-gray-500">{file.size}</p>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 rounded-full text-indigo-600">
                                    <Download size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Teacher Remarks */}
                {homework.remarks && (
                    <div className="mt-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Teacher Feedback</h3>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <p className="text-sm text-blue-900 italic font-medium">"{homework.remarks}"</p>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default HomeworkDetailPage;
