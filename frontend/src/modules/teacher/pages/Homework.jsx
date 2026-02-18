import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Plus, Filter } from 'lucide-react';
import gsap from 'gsap';
import { AnimatePresence } from 'framer-motion';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import HomeworkTabs from '../components/homework/HomeworkTabs';
import HomeworkCard from '../components/homework/HomeworkCard';
import CreateHomeworkForm from '../components/homework/CreateHomeworkForm';

const HomeworkPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const listRef = useRef(null);
    const homeworkList = useTeacherStore(state => state.homeworkList);
    const fetchHomeworkList = useTeacherStore(state => state.fetchHomeworkList);
    const isFetching = useTeacherStore(state => state.isFetchingHomework);
    const assignedClasses = useTeacherStore(state => state.assignedClasses);
    const fetchAssignedClasses = useTeacherStore(state => state.fetchAssignedClasses);

    const [activeTab, setActiveTab] = useState('active');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filteredHomework, setFilteredHomework] = useState([]);
    const [selectedClassFilter, setSelectedClassFilter] = useState(null); // { classId, sectionId, label } or null for All

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 2,
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    // Fetch assigned classes for form + class filter options
    useEffect(() => {
        fetchAssignedClasses(true);
    }, [fetchAssignedClasses]);

    // Fetch Homework (with class filter when selected)
    useEffect(() => {
        const params = selectedClassFilter
            ? { classId: selectedClassFilter.classId, sectionId: selectedClassFilter.sectionId }
            : {};
        fetchHomeworkList(params);
    }, [fetchHomeworkList, selectedClassFilter]);

    // Filter Logic: All | Active (published + due not passed) | Past (published + due passed) | Drafts
    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filtered = homeworkList.filter(hw => {
            const due = hw.dueDate ? new Date(hw.dueDate) : null;
            const isDraft = hw.status === 'draft' || hw.status === 'Draft';
            const isPublished = hw.status === 'published' || hw.status === 'Active';
            const isPastDue = due && due < today;

            if (activeTab === 'all') return true;
            if (activeTab === 'active') return isPublished && !isPastDue;
            if (activeTab === 'past') return isPublished && isPastDue;
            if (activeTab === 'draft') return isDraft;
            return true;
        });
        setFilteredHomework(filtered);
    }, [activeTab, homeworkList]);

    // Animation on Filter Change (with cleanup)
    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const ctx = gsap.context(() => {
            gsap.fromTo(el.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        }, el);
        return () => { try { ctx.revert(); } catch (_) { /* ignore */ } };
    }, [filteredHomework]);

    // Flatten mappings for the form - only assigned subjects (exclude "Class Teacher" for homework)
    const flatMappings = assignedClasses
        .filter(sub => sub.subjectId != null)
        .flatMap(sub =>
            sub.classes.map(cls => ({
                id: `${sub.subjectId}_${cls.classId}_${cls.sectionId}`,
                subjectId: sub.subjectId,
                subjectName: sub.subjectName,
                classId: cls.classId,
                sectionId: cls.sectionId,
                className: cls.fullClassName,
                students: 0
            }))
        );

    // Unique classes for filter dropdown (from flatMappings, deduped by classId_sectionId)
    const classFilterOptions = Array.from(
        new Map(
            flatMappings.map(m => [`${m.classId}_${m.sectionId}`, { classId: m.classId, sectionId: m.sectionId, label: m.className }])
        ).values()
    );

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Homework</h1>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4">
                {/* 1. Tabs */}
                <HomeworkTabs activeTab={activeTab} onTabChange={setActiveTab} />

                {/* 2. Class Filter */}
                {classFilterOptions.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class</span>
                        <select
                            value={selectedClassFilter ? `${selectedClassFilter.classId}_${selectedClassFilter.sectionId}` : ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (!v) {
                                    setSelectedClassFilter(null);
                                    return;
                                }
                                const opt = classFilterOptions.find(o => `${o.classId}_${o.sectionId}` === v);
                                if (opt) setSelectedClassFilter(opt);
                            }}
                            className="flex-1 py-2 px-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_0.75rem_center] bg-no-repeat pr-9"
                        >
                            <option value="">All Classes</option>
                            {classFilterOptions.map((opt) => (
                                <option key={`${opt.classId}_${opt.sectionId}`} value={`${opt.classId}_${opt.sectionId}`}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 3. Homework List */}
                <div ref={listRef} className="mt-2 min-h-[300px]">
                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
                            <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
                            <p className="text-sm font-medium text-gray-500">Loading homeworks...</p>
                        </div>
                    ) : filteredHomework.length > 0 ? (
                        filteredHomework.map(hw => (
                            <HomeworkCard
                                key={hw._id || hw.id}
                                homework={hw}
                                onClick={() => navigate(`/teacher/homework/${hw._id || hw.id}`)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="bg-gray-100 p-4 rounded-full mb-3">
                                <Filter size={24} />
                            </div>
                            <p className="text-sm font-medium">No homework found in this section.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <CreateHomeworkForm
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        classes={flatMappings}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HomeworkPage;
