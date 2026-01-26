
import React from 'react';
import { Smartphone, Mail, Globe } from 'lucide-react';

const TemplatePreview = ({ channel, subject, content, variables }) => {

    // Mock Data
    const mockData = {
        '{{student_name}}': 'Rahul Sharma',
        '{{class_section}}': 'X-A',
        '{{due_amount}}': '₹12,000',
        '{{due_date}}': '31st Jan 2026',
        '{{school_name}}': 'Sunshine Intl School',
        '{{exam_name}}': 'Term 2 Finals',
        '{{absent_date}}': '27-01-2026'
    };

    const processContent = (text) => {
        if (!text) return '';
        let processed = text;
        Object.keys(mockData).forEach(key => {
            processed = processed.split(key).join(mockData[key]);
        });
        // Highlight remaining (unresolved) variables
        return processed;
    };

    const resolvedSubject = processContent(subject);
    const resolvedContent = processContent(content);

    if (channel === 'SMS') {
        return (
            <div className="bg-gray-900 rounded-3xl p-4 w-[280px] mx-auto border-4 border-gray-800 shadow-2xl relative">
                {/* Phone Speaker */}
                <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mb-6"></div>

                {/* Screen */}
                <div className="bg-gray-100 h-[400px] rounded-lg overflow-hidden flex flex-col relative font-sans">
                    <div className="bg-indigo-600 h-12 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        Messages
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto">
                        <div className="bg-gray-200 rounded-xl rounded-tl-none p-3 text-sm text-gray-800 shadow-sm max-w-[85%] mt-4">
                            {resolvedContent || <span className="text-gray-400 italic">No content...</span>}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 ml-1">Just now • SENT</div>
                    </div>
                </div>

                {/* Home Button Mock */}
                <div className="w-8 h-8 rounded-full border border-gray-700 mx-auto mt-4"></div>
            </div>
        );
    }

    if (channel === 'EMAIL') {
        return (
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-full max-w-sm mx-auto h-[400px] flex flex-col">
                <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="bg-white border rounded px-2 py-0.5 text-[10px] text-gray-500 flex-1 text-center">
                        Subject: {resolvedSubject || '...'}
                    </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto font-sans text-sm text-gray-800">
                    <div className="mb-4 text-xs text-gray-500">From: admin@school.com<br />To: parent@example.com</div>
                    <hr className="border-gray-100 mb-4" />
                    {resolvedContent ? (
                        <div dangerouslySetInnerHTML={{ __html: resolvedContent.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <span className="text-gray-300 italic">Email Body Preview...</span>
                    )}
                </div>
            </div>
        );
    }

    // Default: App Notification
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-xs mx-auto mt-10">
            <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 font-bold text-sm">
                    <Globe size={14} /> School App
                </div>
                <span className="text-[10px] opacity-80">now</span>
            </div>
            <div className="p-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{resolvedSubject || 'Notification Title'}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                    {resolvedContent || 'Notification messages will appear here as they would on a user device.'}
                </p>
            </div>
            <div className="h-1 bg-gray-100 mx-4 mb-4 rounded overflow-hidden">
                <div className="w-1/3 h-full bg-indigo-500"></div>
            </div>
        </div>
    );
};

export default TemplatePreview;
