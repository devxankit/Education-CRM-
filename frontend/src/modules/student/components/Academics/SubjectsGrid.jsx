import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Book } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SubjectCard = ({ subject }) => {
    return (
        <div className="subject-card group bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all active:scale-[0.98] cursor-pointer relative overflow-hidden">

            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${subject.color}`}>
                    <Book size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    {subject.code}
                </span>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{subject.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{subject.teacher}</p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-gray-400">
                        {subject.classesPerWeek} classes/week
                    </span>
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronRight size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SubjectsGrid = ({ subjects }) => {
    const gridRef = useRef(null);

    useEffect(() => {
        if (!gridRef.current) return;
        
        const ctx = gsap.context(() => {
            const cards = gridRef.current.querySelectorAll('.subject-card');
            if (cards.length === 0) return;

            // Set initial hidden state
            gsap.set('.subject-card', { y: 30, opacity: 0 });

            // Check if element is already in viewport
            const rect = gridRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const isAlreadyInView = rect.top < viewportHeight * 0.85;

            if (isAlreadyInView) {
                // If already in view, animate immediately
                gsap.to('.subject-card', {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: 'back.out(1.2)',
                });
            } else {
                // Otherwise, use ScrollTrigger
                gsap.to('.subject-card', {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                });
            }
        }, gridRef);
        
        return () => {
            ctx.revert();
        };
    }, [subjects]);

    return (
        <div ref={gridRef}>
            <h3 className="font-bold text-gray-800 text-lg mb-4 px-1">My Subjects</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {subjects.map((sub) => (
                    <SubjectCard key={sub.id} subject={sub} />
                ))}
            </div>
        </div>
    );
};

export default SubjectsGrid;
