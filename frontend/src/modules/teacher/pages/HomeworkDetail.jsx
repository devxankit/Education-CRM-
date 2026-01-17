
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Info, Calendar, FileText, Users, Link } from 'lucide-react';
import { homeworkData } from '../data/homeworkData';

const HomeworkDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // In a real app, fetch based on ID. Here we just take the first one or mock it.
    const homework = homeworkData.list[0] || {};

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Homework Details</h1>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-6">

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                    <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                            {homework.subject}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${homework.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {homework.status}
                        </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">{homework.title || 'Homework Title'}</h2>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                            <Users size={14} /> Class {homework.class || '10-A'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={14} /> Due: {new Date().toLocaleDateString()}
                        </span>
                    </div>

                    <div className="prose prose-sm text-gray-600 mb-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-2">Instructions</h3>
                        <p>
                            Please complete the attached worksheet and submit it by the due date.
                            Ensure all diagrams are labeled correctly.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-900">Attachments</h3>
                        <div
                            onClick={() => alert("Downloading attachment... (Mock)")}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <FileText size={18} />
                            </div>
                            <div className="flex-1">
                                <span className="block text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Worksheet_Ch4.pdf</span>
                                <span className="text-xs text-gray-400">2.4 MB</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Submissions</h3>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Total Submitted</span>
                        <span className="text-sm font-bold text-gray-900">24/30</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <button
                        onClick={() => navigate('/teacher/homework/submissions')}
                        className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        View All Submissions
                    </button>
                </div>

            </main>
        </div>
    );
};

export default HomeworkDetailPage;
