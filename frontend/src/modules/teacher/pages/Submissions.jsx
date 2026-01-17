
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Filter, Eye, X, FileText } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { submissionsData } from '../data/submissionsData';

const SubmissionsPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All'); // All, Submitted, Pending, Late
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const filteredList = submissionsData.filter(sub => {
        const matchesStatus =
            filter === 'All' ? true :
                filter === 'Submitted' ? sub.status === 'Submitted' :
                    filter === 'Pending' ? sub.status === 'Pending' :
                        filter === 'Late' ? sub.status === 'Late' : true;

        const matchesSearch = sub.student.toLowerCase().includes(searchText.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const handleViewFile = (file) => {
        setPreviewFile(file);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Submissions</h1>
                </div>
            </div>

            <main className="max-w-md mx-auto px-4 pt-4">

                {/* Search & Filter Trigger */}
                <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 border rounded-xl transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:text-indigo-600'}`}
                    >
                        <Filter size={20} />
                    </button>
                </div>

                {/* Filter Tabs (Collapsible) */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide pt-1">
                                {['All', 'Submitted', 'Pending', 'Late'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === status
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-white text-gray-500 border border-gray-200'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* List */}
                <div className="space-y-3">
                    {filteredList.map((sub) => (
                        <div key={sub.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                    {sub.roll}
                                </span>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{sub.student}</h4>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sub.status === 'Submitted' ? 'bg-green-50 text-green-600' :
                                        sub.status === 'Late' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        {sub.status}
                                    </span>
                                </div>
                            </div>

                            {sub.file ? (
                                <button
                                    onClick={() => handleViewFile(sub.file)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg active:scale-95 transition-transform"
                                >
                                    <Eye size={18} />
                                </button>
                            ) : (
                                <span className="text-[10px] text-gray-400 font-medium italic">No File</span>
                            )}
                        </div>
                    ))}
                    {filteredList.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            No submissions found.
                        </div>
                    )}
                </div>

            </main>

            {/* File Preview Modal */}
            <AnimatePresence>
                {previewFile && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewFile(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <FileText size={18} className="text-indigo-600" />
                                    {previewFile}
                                </h3>
                                <button
                                    onClick={() => setPreviewFile(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-8 bg-gray-50 flex flex-col items-center justify-center min-h-[300px]">
                                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                    <FileText size={48} className="text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium mb-4">File Preview Not Available</p>
                                <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                                    Download File
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubmissionsPage;
