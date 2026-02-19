import React, { useRef, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import gsap from 'gsap';

const HomeworkCard = ({ homework, index, onClick }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: index * 0.05, ease: 'power2.out' }
        );
        return () => {
            try { if (cardRef.current) gsap.killTweensOf(cardRef.current); } catch (_) { /* ignore */ }
        };
    }, [index]);

    // Status Config
    const statusConfig = {
        Pending: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: Clock },
        Submitted: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: CheckCircle },
        Graded: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle },
        Overdue: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: AlertCircle },
        Late: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100', icon: AlertCircle },
    };

    const config = statusConfig[homework.status] || statusConfig.Pending;
    const StatusIcon = config.icon;
    const isOverdue = homework.status === 'Overdue';

    return (
        <div
            ref={cardRef}
            onClick={() => onClick(homework)}
            className={`bg-white rounded-2xl p-4 border shadow-sm relative overflow-hidden cursor-pointer group mb-3 transition-all active:scale-[0.99] hover:border-gray-300 ${isOverdue ? 'border-red-100' : 'border-gray-100'}`}
        >
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-gray-50 text-gray-600`}>
                    {homework.subject}
                </span>
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.bg} ${config.color} ${config.border}`}>
                    <StatusIcon size={12} />
                    {homework.status}
                </span>
            </div>

            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 pr-4">{homework.title}</h3>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Assign: {new Date(homework.assignedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                </div>
                {!isOverdue && (
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                            Due: {new Date(homework.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                )}
            </div>

            {/* Overdue Warning or Feedback Preview */}
            {isOverdue && (
                <div className="flex items-center gap-2 text-xs font-medium text-yellow-600 bg-yellow-50 p-2 rounded-lg mt-2">
                    <AlertCircle size={14} />
                    <span>Deadline passed. You can still submit (will be marked as Late).</span>
                </div>
            )}

            {(homework.status === 'Checked' || homework.status === 'Graded') && homework.feedback && (
                <div className="flex items-center justify-between bg-emerald-50/50 p-2 rounded-lg mt-2 border border-emerald-50">
                    <span className="text-xs text-emerald-700 font-medium line-clamp-1 italic">"{homework.feedback.remarks}"</span>
                    <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded shadow-sm">
                        {homework.feedback.marks}/{homework.feedback.maxMarks}
                    </span>
                </div>
            )}

            {/* Action Hint */}
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                <span className="text-gray-400">By {homework.teacher}</span>
                <span
                    className="text-primary font-semibold flex items-center group-hover:translate-x-1 transition-transform"
                    onClick={(e) => { e.stopPropagation(); onClick(homework); }}
                >
                    {(homework.status === 'Pending' || homework.status === 'Overdue') ? 'Submit Now' : 'View Details'} →
                </span>
            </div>
        </div>
    );
};

export default HomeworkCard;
