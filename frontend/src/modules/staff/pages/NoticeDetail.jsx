import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, FileText, Download, Clock } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';

// --- MOCK DATA (Multiple notices for filtering by ID) ---
const MOCK_NOTICES_DATA = [
    {
        id: 'N-2024-001',
        title: 'Emergency: School Closed Tomorrow due to Heavy Rain Forecast',
        category: 'Emergency',
        priority: 'Urgent',
        date: '10 Oct 2024, 02:30 PM',
        sender: 'Principal\'s Office',
        content: `
            <p>Dear Staff,</p>
            <p>Due to the red alert issued by the meteorological department regarding heavy rainfall, the school administration has decided to keep the school <strong>closed tomorrow, 11th October 2024</strong>.</p>
            <p>This applies to all students and non-essential staff. Essential maintenance team members are requested to remain on standby.</p>
            <p>Online classes will proceed as per the schedule shared by the academic coordinator.</p>
            <p>Stay safe.</p>
            <br/>
            <p>Regards,<br/>Principal</p>
        `,
        attachments: [
            { name: 'District_Order_Circular.pdf', size: '1.2 MB' }
        ],
        status: 'Pending'
    },
    {
        id: 'N-2024-002',
        title: 'Annual Day Celebration Schedule',
        category: 'Event',
        priority: 'Normal',
        date: '08 Oct 2024, 10:00 AM',
        sender: 'Cultural Committee',
        content: `
            <p>Dear Staff,</p>
            <p>The Annual Day celebration is scheduled for <strong>25th November 2024</strong>.</p>
            <p>Please submit your program proposals by 20th October.</p>
            <br/>
            <p>Regards,<br/>Cultural Committee</p>
        `,
        attachments: [],
        status: 'Read'
    },
    {
        id: 'N-2024-003',
        title: 'Salary Revision Notification',
        category: 'HR',
        priority: 'Important',
        date: '05 Oct 2024, 04:00 PM',
        sender: 'HR Department',
        content: `
            <p>Dear Staff,</p>
            <p>We are pleased to announce a salary revision effective from November 2024.</p>
            <p>Individual letters will be shared via email.</p>
            <br/>
            <p>Regards,<br/>HR Department</p>
        `,
        attachments: [
            { name: 'Salary_Revision_Policy.pdf', size: '850 KB' }
        ],
        status: 'Pending'
    }
];

const NoticeDetail = () => {
    const { noticeId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();

    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('Pending');
    const [isAcknowledging, setIsAcknowledging] = useState(false);

    // Fetch notice data based on ID from URL
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Simulate API call - In real app, replace with actual API fetch
        setTimeout(() => {
            const foundNotice = MOCK_NOTICES_DATA.find(n => n.id === noticeId);
            if (foundNotice) {
                setNotice(foundNotice);
                setStatus(foundNotice.status);
            } else {
                setError('Notice not found');
            }
            setLoading(false);
        }, 300);
    }, [noticeId]);

    // Loading state
    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-10 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading notice...</p>
            </div>
        );
    }

    // Error state
    if (error || !notice) {
        return (
            <div className="max-w-3xl mx-auto p-10 text-center">
                <p className="text-red-600 font-bold">{error || 'Notice not found'}</p>
                <button
                    onClick={() => navigate('/staff/notices')}
                    className="mt-4 text-indigo-600 hover:underline"
                >
                    ← Back to Notices
                </button>
            </div>
        );
    }

    const handleAcknowledge = () => {
        setIsAcknowledging(true);
        // Simulate API
        setTimeout(() => {
            setStatus('Read');
            setIsAcknowledging(false);
        }, 800);
    };

    return (
        <div className="max-w-3xl mx-auto md:pb-6 pb-24 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 flex items-center gap-3 shadow-sm">
                <button onClick={() => navigate('/staff/notices')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-sm font-bold text-gray-900 line-clamp-1">{notice.title}</h1>
                    <p className="text-[10px] text-gray-500 font-mono">
                        {notice.date} • {notice.category}
                    </p>
                </div>
            </div>

            <div className="p-4 md:p-8 space-y-6">

                {/* Meta Card */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">From</p>
                        <p className="font-bold text-gray-900 text-sm">{notice.sender}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Priority</p>
                        <span className={`px-2 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${notice.priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                            {notice.priority === 'Urgent' && <AlertTriangle size={12} />}
                            {notice.priority}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
                    <div
                        className="prose prose-sm max-w-none text-gray-800"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                    />
                </div>

                {/* Attachments */}
                {notice.attachments.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Attachments</h3>
                        <div className="space-y-2">
                            {notice.attachments.map((file, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between hover:border-indigo-300 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 text-red-600 rounded">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600">{file.name}</p>
                                            <p className="text-xs text-gray-400">{file.size}</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-indigo-600 p-2">
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Acknowledge Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:static md:rounded-xl md:mx-4 md:mb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                {status === 'Pending' ? (
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500 text-center mb-1">
                            By clicking below, you confirm that you have read and understood this notice.
                        </p>
                        <button
                            onClick={handleAcknowledge}
                            disabled={isAcknowledging}
                            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {isAcknowledging ? 'Processing...' : (
                                <><CheckCircle size={18} /> Acknowledge</>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-center gap-2 text-green-700">
                        <CheckCircle size={20} className="text-green-600" />
                        <div>
                            <p className="text-sm font-bold">Acknowledged</p>
                            <p className="text-[10px] opacity-80">You confirmed this on {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default NoticeDetail;
