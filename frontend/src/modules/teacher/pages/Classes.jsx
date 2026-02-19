import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { Info, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useTeacherStore } from '../../../store/teacherStore';

// Components
import TeacherHeader from '../components/common/TeacherHeader';
import SubjectCard from '../components/classes/SubjectCard';
import SubjectAccordion from '../components/classes/SubjectAccordion';

const ClassesPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Store
    const profile = useTeacherStore(state => state.profile);
    const assignedClasses = useTeacherStore(state => state.assignedClasses);
    const fetchAssignedClasses = useTeacherStore(state => state.fetchAssignedClasses);
    const fetchProfile = useTeacherStore(state => state.fetchProfile);
    const isFetchingClasses = useTeacherStore(state => state.isFetchingClasses);

    // Fetch on mount
    useEffect(() => {
        fetchProfile();
        fetchAssignedClasses();
    }, []);

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

    // Animations
    useEffect(() => {
        if (!isFetchingClasses && assignedClasses.length > 0) {
            const ctx = gsap.context(() => {
                gsap.from('.subject-card', {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    delay: 0.2
                });
            }, containerRef);
            return () => {
                try { ctx.revert(); } catch (_) { /* ignore DOM errors on unmount */ }
            };
        }
    }, [isFetchingClasses, assignedClasses]);

    const getSubjectIcon = (name) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('math')) return 'Calculator';
        if (lowerName.includes('physic')) return 'Atom';
        if (lowerName.includes('chem')) return 'FlaskConical';
        if (lowerName.includes('bio') || lowerName.includes('science')) return 'Atom';
        if (lowerName.includes('history') || lowerName.includes('social')) return 'Globe';
        if (lowerName.includes('computer') || lowerName.includes('it')) return 'Cpu';
        if (lowerName.includes('music')) return 'Music';
        return 'BookOpen';
    };

    const mappedSubjects = assignedClasses.map(sub => ({
        id: sub.subjectId,
        name: sub.subjectName,
        icon: getSubjectIcon(sub.subjectName),
        code: sub.subjectCode,
        year: sub.academicYear,
        status: sub.status === 'ACTIVE' ? 'Active' : 'N/A',
        classCount: sub.classesCount,
        students: sub.totalStudents,
        classes: sub.classes.map(cls => ({
            id: `${cls.classId}_${cls.sectionId}`, // Compound ID to pass both identifiers
            classId: cls.classId,
            sectionId: cls.sectionId,
            name: cls.fullClassName,
            schedule: cls.schedule,
            students: cls.studentCount
        }))
    }));

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-24">
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
                        <h1 className="text-lg font-bold text-gray-900">Classes & Subjects</h1>
                    </div>
                    <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                        <Info size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-6">
                {isFetchingClasses ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Fetching your schedule...</p>
                    </div>
                ) : mappedSubjects.length > 0 ? (
                    <>
                        {/* 1. Subjects Overview Grid */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Subjects</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {mappedSubjects.map(subject => (
                                    <div key={subject.id} className="subject-card">
                                        <SubjectCard subject={subject} onClick={() => document.getElementById('class-management').scrollIntoView({ behavior: 'smooth' })} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Detailed Class List (Accordion) */}
                        <div>
                            <h2 id="class-management" className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Class Management</h2>
                            <div className="space-y-3">
                                {mappedSubjects.map((subject, index) => (
                                    <div key={subject.id} className="subject-card">
                                        <SubjectAccordion subject={subject} defaultOpen={index === 0} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No classes assigned to you yet.</p>
                        <p className="text-[10px] text-gray-400 mt-2">Please contact your administrator for your teaching schedule.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ClassesPage;
