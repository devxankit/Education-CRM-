
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, FileText, Download, Clock, BookOpen, Filter } from 'lucide-react';
import Lenis from 'lenis';

// Data
import { notesData, subjects } from '../data/notesData';

const Notes = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateSort, setDateSort] = useState('newest'); // newest, oldest
    const [showFilters, setShowFilters] = useState(false);

    // Filtered & Sorted Data
    const filteredNotes = notesData
        .filter(note => {
            const matchesTab = activeTab === 'All' || note.subject === activeTab;
            const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.subject.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
                <div className="max-w-md mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">Study Notes</h1>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="px-4 py-4 max-w-md mx-auto sticky top-[61px] z-20 bg-gray-50/95 backdrop-blur-sm pb-2">
                <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search topics, subjects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        <Filter size={18} />
                    </button>
                </div>

                {/* Filter Options */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 hide-scrollbar">
                                {['newest', 'oldest'].map((sort) => (
                                    <button
                                        key={sort}
                                        onClick={() => setDateSort(sort)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-colors ${dateSort === sort
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {sort === 'newest' ? 'Newest First' : 'Oldest First'}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Subject Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mt-4 hide-scrollbar">
                    {subjects.map((subject) => (
                        <button
                            key={subject}
                            onClick={() => setActiveTab(subject)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === subject
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="px-4 max-w-md mx-auto space-y-3 pt-2">
                <AnimatePresence mode="popLayout">
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note, index) => (
                            <motion.div
                                key={note.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className="group bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${note.type === 'PDF' ? 'bg-red-50 text-red-600' :
                                                note.type === 'PPT' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-blue-50 text-blue-600'
                                            }`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{note.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                                                    {note.subject}
                                                </span>
                                                <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                                                    <Clock size={10} /> {note.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-indigo-600 transition-colors">
                                        <Download size={18} />
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">
                                    {note.description}
                                </p>

                                <div className="mt-3 flex items-center justify-between border-t border-gray-50 pt-2">
                                    <span className="text-[10px] text-gray-400">
                                        By {note.author}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded-full">
                                        {note.size} • {note.type}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen size={24} className="text-gray-300" />
                            </div>
                            <h3 className="text-gray-900 font-medium text-sm">No notes found</h3>
                            <p className="text-gray-500 text-xs mt-1">Try adjusting your search or filters</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Notes;
