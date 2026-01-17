import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';
import { noticesData } from '../data/noticesData';

const NoticeDetail = () => {
    // In a real app, use useParams() to fetch the specific notice
    // const { id } = useParams();
    const navigate = useNavigate();
    const notice = noticesData[0]; // MOCK: Always show first for demo

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
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-4 ${notice.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {notice.priority}
                </span>

                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{notice.title}</h2>

                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-8 pb-8 border-b border-gray-100">
                    <Calendar size={14} />
                    <span>Posted on {new Date(notice.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>From: Admin Office</span>
                </div>

                <div className="prose prose-sm text-gray-600 leading-relaxed">
                    <p>{notice.content}</p>
                    <p>Please ensure this is communicated to your respective classes as well.</p>
                </div>
            </main>
        </div>
    );
};

export default NoticeDetail;
