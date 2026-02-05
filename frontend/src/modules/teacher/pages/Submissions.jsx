import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Search, Filter, Eye, X, FileText, ArrowLeft, Calendar, FileDigit, CheckCircle, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTeacherStore } from '../../../store/teacherStore';

const SubmissionsPage = () => {
    const navigate = useNavigate();
    const { id: homeworkId } = useParams();
    const { fetchHomeworkSubmissions, submissions, isFetchingSubmissions, gradeSubmission, homeworkList, fetchHomeworkList } = useTeacherStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradingMarks, setGradingMarks] = useState('');
    const [gradingFeedback, setGradingFeedback] = useState('');

    const homework = homeworkList.find(h => h._id === homeworkId);

    useEffect(() => {
        if (homeworkId) {
            fetchHomeworkSubmissions(homeworkId);
        }
    }, [homeworkId, fetchHomeworkSubmissions]);

    // Derived State
    const filteredSubmissions = submissions.filter(sub => {
        const studentName = `${sub.studentId?.firstName || ''} ${sub.studentId?.lastName || ''}`.toLowerCase();
        const matchesSearch = studentName.includes(searchQuery.toLowerCase()) ||
            (sub.studentId?.admissionNo || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'All' || sub.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: submissions.length,
        submitted: submissions.filter(s => s.status === 'Submitted' || s.status === 'Graded').length,
        pending: submissions.filter(s => s.status === 'Pending').length,
        graded: submissions.filter(s => s.status === 'Graded').length
    };

    const handleGrade = async () => {
        if (!selectedSubmission) return;
        const result = await gradeSubmission(selectedSubmission._id, {
            marks: parseFloat(gradingMarks),
            feedback: gradingFeedback
        });
        if (result.success) {
            setSelectedSubmission(null);
            alert('Submission graded successfully');
        } else {
            alert('Failed to grade submission');
        }
    };

    const openGradingModal = (sub) => {
        setSelectedSubmission(sub);
        setGradingMarks(sub.marks || '');
        setGradingFeedback(sub.feedback || '');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Submissions</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{homework?.title || 'Loading...'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 pt-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <StatCard label="Total Submissions" value={stats.total} color="bg-blue-50 text-blue-600 border-blue-100" />
                    <StatCard label="Reviewed" value={stats.graded} color="bg-indigo-50 text-indigo-600 border-indigo-100" />
                    <StatCard label="Pending Grade" value={stats.submitted - stats.graded} color="bg-amber-50 text-amber-600 border-amber-100" />
                    <StatCard label="Status Check" value={'86%'} color="bg-emerald-50 text-emerald-600 border-emerald-100" />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {['All', 'Submitted', 'Graded', 'Late'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${filterStatus === status ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submissions List */}
                <div className="space-y-4">
                    {isFetchingSubmissions ? (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-sm font-medium">Loading submissions...</p>
                        </div>
                    ) : filteredSubmissions.length > 0 ? (
                        filteredSubmissions.map(sub => (
                            <div key={sub._id} className="bg-white p-5 rounded-3xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-inner">
                                            {sub.studentId?.photo ? <img src={sub.studentId.photo} alt="" className="w-full h-full object-cover" /> : sub.studentId?.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 leading-tight">{sub.studentId?.firstName} {sub.studentId?.lastName}</h3>
                                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">ID: {sub.studentId?.admissionNo}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <StatusBadge status={sub.status} />
                                        {sub.marks !== undefined && (
                                            <span className="text-[11px] font-bold text-indigo-600">
                                                {sub.marks} Score
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 mb-4">
                                    <p className="text-xs text-gray-600 line-clamp-2 italic">
                                        "{sub.content || 'Submission contains files only.'}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {sub.submissionDate ? new Date(sub.submissionDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                        {sub.attachments?.length > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <FileText size={14} />
                                                {sub.attachments.length} Files
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => openGradingModal(sub)}
                                        className="text-xs font-bold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-1.5 shadow-md shadow-gray-200"
                                    >
                                        {sub.status === 'Graded' ? 'Update Grade' : 'Grade Roster'} <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                            <div className="bg-gray-100 p-6 rounded-3xl mb-4">
                                <FileText size={40} />
                            </div>
                            <p className="text-sm font-bold">No submissions found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Grading Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSubmission(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Evaluation Hub</h2>
                                    <p className="text-xs text-gray-400 font-medium">Grading for {selectedSubmission.studentId?.firstName}</p>
                                </div>
                                <button onClick={() => setSelectedSubmission(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                {selectedSubmission.content && (
                                    <div className="bg-indigo-50/50 p-5 rounded-[1.5rem] border border-indigo-100">
                                        <h4 className="text-[10px] font-bold text-indigo-600 uppercase mb-2 tracking-widest">Student Response</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                            {selectedSubmission.content}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Score Awarded</label>
                                        <input
                                            type="number"
                                            value={gradingMarks}
                                            onChange={(e) => setGradingMarks(e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-base font-bold"
                                            placeholder="Enter marks"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Teacher Feedback</label>
                                        <textarea
                                            rows={4}
                                            value={gradingFeedback}
                                            onChange={(e) => setGradingFeedback(e.target.value)}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                                            placeholder="Great work! focus on..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pt-0 flex gap-4">
                                <button
                                    onClick={() => setSelectedSubmission(null)}
                                    className="flex-1 py-4 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                                >
                                    Review Later
                                </button>
                                <button
                                    onClick={handleGrade}
                                    className="flex-[1.5] py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <CheckCircle size={20} /> Finalize Grade
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ label, value, color }) => (
    <div className={`${color} p-4 rounded-2xl border flex flex-col items-center justify-center shadow-sm`}>
        <span className="text-lg font-bold">{value}</span>
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{label}</span>
    </div>
);

const StatusBadge = ({ status }) => {
    const configs = {
        'Submitted': 'bg-blue-50 text-blue-600 border-blue-200',
        'Graded': 'bg-emerald-50 text-emerald-600 border-emerald-200',
        'Late': 'bg-red-50 text-red-600 border-red-200',
        'Pending': 'bg-amber-50 text-amber-600 border-amber-200'
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${configs[status] || 'bg-gray-100'}`}>
            {status}
        </span>
    );
};

export default SubmissionsPage;
