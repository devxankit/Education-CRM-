import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, FileText, Download, Clock } from 'lucide-react';
import { useStaffAuth } from '../context/StaffAuthContext';

const MOCK_NOTICE = {
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
    status: 'Pending' // or 'Read'
};

const NoticeDetail = () => {
    const { noticeId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const [status, setStatus] = useState(MOCK_NOTICE.status);
    const [isAcknowledging, setIsAcknowledging] = useState(false);

    // In a real app, you'd fetch the notice by noticeId
    const notice = MOCK_NOTICE;

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
