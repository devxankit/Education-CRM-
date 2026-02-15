import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';

const SupportPage = () => {
    const navigate = useNavigate();
    const { queries, fetchQueries, resolveQuery, isFetchingQueries, isResolvingQuery } = useTeacherStore();
    const [activeTab, setActiveTab] = useState('Open');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchQueries();
    }, [fetchQueries]);

    const handleResolve = async (id) => {
        const result = await resolveQuery(id);
        if (result.success) {
            alert("Query marked as resolved!");
        } else {
            alert("Failed to resolve query. Please try again.");
        }
    };

    const filteredQueries = queries
        .filter(q => q.status === activeTab)
        .filter(q => {
            if (!searchQuery) return true;
            const searchLower = searchQuery.toLowerCase();
            return (
                q.topic?.toLowerCase().includes(searchLower) ||
                q.details?.toLowerCase().includes(searchLower) ||
                q.studentId?.firstName?.toLowerCase().includes(searchLower) ||
                q.studentId?.lastName?.toLowerCase().includes(searchLower)
            );
        });

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Student Resolution</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-6">

                {/* Search */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search queries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 bg-gray-200/50 p-1 rounded-xl">
                    {['Open', 'Resolved'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {isFetchingQueries ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                    </div>
                ) : (
                    /* Query List */
                    <div className="space-y-3">
                        {filteredQueries.length > 0 ? (
                            filteredQueries.map(query => {
                                const student = query.studentId;
                                const parent = student?.parentId;
                                const parentName = parent?.name || '';
                                const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown';
                                const className = student?.classId?.name || 'N/A';
                                const sectionName = student?.sectionId?.name || '';
                                const classSection = sectionName ? `${className}-${sectionName}` : className;
                                const isParentTicket = query.raisedByType === 'Parent';

                                // Display logic: Use parent name for parent tickets, student name for student tickets
                                const displayName = isParentTicket && parentName ? `${parentName} (Parent)` : studentName;
                                const initials = (isParentTicket && parentName ? parentName : studentName).split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

                                return (
                                    <div key={query._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-indigo-100 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${query.category === 'Academic' ? 'bg-orange-50 text-orange-600' :
                                                query.category === 'Homework' ? 'bg-blue-50 text-blue-600' :
                                                    query.category === 'Attendance' ? 'bg-purple-50 text-purple-600' :
                                                        'bg-gray-50 text-gray-600'
                                                }`}>
                                                {query.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock size={10} /> {new Date(query.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">{query.topic}</h3>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                                            {query.details}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                                                    {initials}
                                                </span>
                                                <div>
                                                    <span className="block text-xs font-bold text-gray-900 leading-none mb-1">
                                                        {displayName}
                                                    </span>
                                                    <span className="block text-[10px] text-gray-400">
                                                        {isParentTicket ? `Student: ${studentName} (${classSection})` : `Class: ${classSection}`}
                                                    </span>
                                                </div>
                                            </div>

                                            {activeTab === 'Open' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleResolve(query._id);
                                                    }}
                                                    disabled={isResolvingQuery}
                                                    className="text-[10px] font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100 hover:bg-green-100 active:scale-95 transition-all flex items-center gap-1 disabled:opacity-50"
                                                >
                                                    <CheckCircle size={12} /> Mark Solved
                                                </button>
                                            )}
                                            {activeTab === 'Resolved' && (
                                                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                                    <CheckCircle size={12} /> Resolved
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-sm text-gray-400 font-medium">No {activeTab.toLowerCase()} queries found.</p>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
};

export default SupportPage;
