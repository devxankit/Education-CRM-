import React, { useRef, useEffect } from 'react';
import { Calendar, Clock, MapPin, Download, BookOpen } from 'lucide-react';
import gsap from 'gsap';

const UpcomingExamCard = ({ exam, index }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: 'power2.out' }
        );
        return () => {
            try { if (cardRef.current) gsap.killTweensOf(cardRef.current); } catch (_) { /* ignore */ }
        };
    }, [index]);

    const subjectsList = Array.isArray(exam?.subjects)
        ? exam.subjects.map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean).join(', ')
        : (exam?.subjects && typeof exam.subjects === 'string' ? exam.subjects : '');
    const subjectsDisplay = subjectsList || 'TBA';

    const dateRaw = exam?.date ?? exam?.startDate ?? (Array.isArray(exam?.subjects)?.[0]?.date);
    const dateObj = dateRaw ? new Date(dateRaw) : null;
    const dateDisplay = dateObj && !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'TBA';

    const timeDisplay = exam?.time ?? (Array.isArray(exam?.subjects)?.[0]?.time) ?? 'TBA';
    const statusDisplay = exam?.status ?? 'Scheduled';

    return (
        <div ref={cardRef} className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm relative overflow-hidden group">
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wide">
                    {statusDisplay}
                </span>
            </div>

            <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Calendar size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight pr-12">{exam?.title ?? exam?.name ?? exam?.examName ?? 'Exam'}</h3>
                    <p className="text-sm font-medium text-purple-600 mt-1">{subjectsDisplay}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-5">
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-xs font-medium">{timeDisplay}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-xs font-medium">{exam?.location ?? 'TBA'}</span>
                </div>
                <div className="col-span-2 flex items-start gap-2 pt-1">
                    <BookOpen size={14} className="text-gray-400 mt-0.5" />
                    <span className="text-xs text-gray-500 leading-snug">{exam?.syllabus ?? '—'}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Date</span>
                    <span className="text-sm font-bold text-gray-900">
                        {dateDisplay}
                    </span>
                </div>

                <div className="flex-1"></div>

                {exam.admitCardUrl && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors active:scale-95">
                        <Download size={14} />
                        Admit Card
                    </button>
                )}
            </div>
        </div>
    );
};

export default UpcomingExamCard;
