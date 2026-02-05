import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, Loader2, FileText } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';

const NoticeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dashboardData = useTeacherStore(state => state.dashboardData);
    const fetchDashboard = useTeacherStore(state => state.fetchDashboard);
    const [notice, setNotice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadNotice = async () => {
            // If dashboard data not available, fetch it
            if (!dashboardData) {
                await fetchDashboard();
            }
        };
        loadNotice();
    }, [dashboardData, fetchDashboard]);

    useEffect(() => {
        if (dashboardData?.recentNotices) {
            const foundNotice = dashboardData.recentNotices.find(n => n._id === id);
            setNotice(foundNotice || null);
            setIsLoading(false);
        }
    }, [dashboardData, id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!notice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center">
                    <FileText className="mx-auto text-gray-300 mb-3" size={40} />
                    <h2 className="text-xl font-bold text-gray-900">Notice not found</h2>
                    <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-medium">Go Back</button>
                </div>
            </div>
        );
    }

    const isUrgent = notice.priority === 'Urgent' || notice.priority === 'High';
    const publishDate = notice.publishDate || notice.createdAt;

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 py-4 px-4 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Notice Details</h1>
            </div>

            <main className="max-w-md mx-auto px-6 py-8">
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                    {notice.priority || 'Normal'}
                </span>

                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{notice.title}</h2>

                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-8 pb-8 border-b border-gray-100">
                    <Calendar size={14} />
                    <span>Posted on {new Date(publishDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>From: {notice.postedBy || 'Admin Office'}</span>
                </div>

                <div className="prose prose-sm text-gray-600 leading-relaxed">
                    <p className="whitespace-pre-wrap">{notice.content}</p>
                    {notice.additionalInfo && (
                        <p className="mt-4">{notice.additionalInfo}</p>
                    )}
                </div>

                {notice.attachments && notice.attachments.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">Attachments</h3>
                        <div className="space-y-2">
                            {notice.attachments.map((attachment, index) => (
                                <a
                                    key={index}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <FileText size={18} className="text-indigo-600" />
                                    <span className="text-sm font-medium text-gray-700">{attachment.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NoticeDetail;
