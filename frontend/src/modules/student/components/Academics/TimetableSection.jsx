import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Video, Coffee } from 'lucide-react';
import gsap from 'gsap';

const TimetableRow = ({ cls, index }) => (
    <div className="timetable-row flex gap-4 p-3 rounded-xl bg-white border border-gray-100 mb-3 last:mb-0">
        <div className="w-16 flex flex-col items-center justify-center border-r border-gray-100 pr-4 shrink-0">
            <span className="text-xs font-bold text-gray-900">{cls.time.split(' - ')[0]}</span>
            <span className="text-[10px] text-gray-400 mt-1">{cls.time.split(' - ')[1]}</span>
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 text-sm truncate">{cls.subject}</h4>
            <p className="text-xs text-gray-500 truncate mt-0.5">{cls.teacher}</p>

            <div className="mt-2 flex items-center gap-2">
                {cls.type === 'online' ? (
                    <a href={cls.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-100 active:scale-95 transition-transform">
                        <Video size={12} /> Join Class
                    </a>
                ) : (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-gray-600 text-[10px] font-medium">
                        <MapPin size={12} /> {cls.room}
                    </div>
                )}
            </div>
        </div>
    </div>
);

const EmptyTimetable = () => (
    <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-dashed border-gray-200"
    >
        <div className="bg-orange-50 p-3 rounded-full text-orange-400 mb-3">
            <Coffee size={24} />
        </div>
        <p className="text-sm font-medium text-gray-600">No classes today!</p>
        <p className="text-xs text-gray-400 mt-1">Take a break or revise your notes.</p>
    </motion.div>
);

const TimetableSection = ({ timetable, activeDay, setActiveDay }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const containerRef = useRef(null);

    // Animate rows when active day changes
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
            );
        }
    }, [activeDay]);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-gray-800 text-lg">Weekly Timetable</h3>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar px-1">
                {days.map((day) => {
                    const isActive = activeDay === day;
                    return (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${isActive ? 'text-white' : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/30"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{day}</span>
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="min-h-[200px]" ref={containerRef}>
                {timetable[activeDay]?.length > 0 ? (
                    timetable[activeDay].map((cls, idx) => (
                        <TimetableRow key={cls.id || idx} cls={cls} index={idx} />
                    ))
                ) : (
                    <EmptyTimetable />
                )}
            </div>
        </div>
    );
};

export default TimetableSection;
