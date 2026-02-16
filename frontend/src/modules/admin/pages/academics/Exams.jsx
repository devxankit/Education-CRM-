import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Calendar, Filter, FileText, Trash2, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminExamStore } from '../../../../store/adminExamStore';
import { useAppStore } from '../../../../store/index';
import ExamFormModal from './components/exams/ExamFormModal';

const Exams = () => {
    const { exams, isFetching, fetchExams, deleteExam } = useAdminExamStore();
    const user = useAppStore(state => state.user);

    // State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam schedule?')) {
            await deleteExam(id);
        }
    };

    const handleEdit = (exam) => {
        setSelectedExam(exam);
        setIsModalOpen(true);
    };

    const filteredExams = useMemo(() =>
        exams.filter(exam =>
            exam.examName.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [exams, searchQuery]
    );

    const totalPages = Math.ceil(filteredExams.length / pageSize) || 1;
    const paginatedExams = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredExams.slice(start, start + pageSize);
    }, [filteredExams, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handlePageChange = (page) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    return (
        <div className="h-full flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Exam Management</h1>
                    <p className="text-gray-500 text-sm">Schedule and manage examinations across classes.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedExam(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        <Plus size={18} /> Schedule Exam
                    </button>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:border-indigo-300 transition-all">
                        <Filter size={16} className="shrink-0" /> Filter
                    </button>
                </div>
            </div>

            {/* Content Table - 5 rows per page, no inner scroll */}
            <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm overflow-visible">
                <table className="w-full text-left">
                    <thead className="sticky top-0 z-10 bg-gray-100 border-b-2 border-gray-200 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Exam Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Period</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Classes</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isFetching ? (
                            Array(3).fill(0).map((_, idx) => (
                                <tr key={idx} className="animate-pulse">
                                    <td colSpan="6" className="px-6 py-5 bg-gray-50/20"></td>
                                </tr>
                            ))
                        ) : paginatedExams.length > 0 ? (
                            paginatedExams.map(exam => (
                                <tr key={exam._id} className="hover:bg-gray-50/50 transition-colors align-middle">
                                    <td className="px-6 py-4 min-h-[52px] align-middle">
                                        <div className="font-bold text-gray-900 text-sm">{exam.examName}</div>
                                        <div className="text-[11px] text-gray-400 font-medium mt-0.5">Updated: {new Date(exam.updatedAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${exam.examType === 'Internal' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                            }`}>
                                            {String(exam.examType || '').replace(/mide/i, 'MID') || exam.examType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex flex-wrap gap-1.5">
                                            {exam.classes?.map(cls => (
                                                <span key={'c-' + cls._id} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                                                    {cls.name}
                                                </span>
                                            ))}
                                            {exam.courses?.map(crs => (
                                                <span key={'cr-' + crs._id} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium">
                                                    {crs.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${exam.status === 'Published' ? 'bg-green-50 text-green-700 border-green-100' :
                                                exam.status === 'Draft' ? 'bg-gray-50 text-gray-500 border-gray-100' :
                                                    'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap align-middle">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(exam)}
                                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exam._id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                    <FileText className="mx-auto mb-3 opacity-20" size={40} />
                                    <p className="text-sm font-medium">No exams scheduled yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!isFetching && filteredExams.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-200 border-t-0 rounded-b-xl -mt-px">
                    <p className="text-xs text-gray-500">
                        Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                        <span className="font-semibold text-gray-700">{Math.min(currentPage * pageSize, filteredExams.length)}</span> of{' '}
                        <span className="font-semibold text-gray-700">{filteredExams.length}</span> exams
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) pageNum = i + 1;
                                else if (currentPage <= 3) pageNum = i + 1;
                                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = currentPage - 2 + i;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <ExamFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedExam(null);
                }}
                exam={selectedExam}
            />
        </div>
    );
};

export default Exams;
