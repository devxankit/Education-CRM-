import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, CheckCircle, Clock } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';

const SupportPage = () => {
    const navigate = useNavigate();
    const { queries, resolveQuery } = useTeacherStore();
    const [activeTab, setActiveTab] = useState('Open');

    const handleResolve = (id) => {
        resolveQuery(id);
        console.log('Resolving Query:', id);
        alert("Query marked as resolved!");
    };

    const filteredQueries = queries.filter(q => q.status === activeTab);

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

                {/* Query List */}
                <div className="space-y-3">
                    {filteredQueries.length > 0 ? (
                        filteredQueries.map(query => (
                            <div key={query.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:border-indigo-100 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${query.category === 'Academic' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {query.category}
                                    </span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Clock size={10} /> {query.timestamp}
                                    </span>
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1">{query.topic}</h3>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                                    {query.details}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-600">
                                            {query.avatar}
                                        </span>
                                        <div>
                                            <span className="block text-xs font-bold text-gray-900">{query.student}</span>
                                            <span className="block text-[10px] text-gray-400 line-clamp-0">Class {query.class}</span>
                                        </div>
                                    </div>

                                    {activeTab === 'Open' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleResolve(query.id);
                                            }}
                                            className="text-[10px] font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-100 hover:bg-green-100 active:scale-95 transition-all flex items-center gap-1"
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
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-sm text-gray-400 font-medium">No {activeTab.toLowerCase()} queries found.</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
};

export default SupportPage;
