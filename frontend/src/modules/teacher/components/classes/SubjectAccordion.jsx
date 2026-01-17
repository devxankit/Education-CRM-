import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Clock, ArrowRight, ClipboardCheck, BookOpen, Edit3 } from 'lucide-react';

const ClassCard = ({ classData }) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate('/teacher/classes')}
            className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-3 last:mb-0 hover:bg-white hover:shadow-sm transition-all group cursor-pointer"
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-sm font-bold text-gray-900">{classData.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">{classData.schedule}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-gray-200 text-xs font-semibold text-gray-600">
                    <Users size={12} />
                    {classData.students}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-200/50">
                <button
                    onClick={(e) => { e.stopPropagation(); navigate('/teacher/attendance'); }}
                    className="flex flex-col items-center gap-1 p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Mark Attendance"
                >
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><ClipboardCheck size={14} /></div>
                    <span className="text-[9px] font-medium text-gray-500">Attend</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); navigate('/teacher/homework'); }}
                    className="flex flex-col items-center gap-1 p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Homework"
                >
                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><BookOpen size={14} /></div>
                    <span className="text-[9px] font-medium text-gray-500">Work</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); navigate('/teacher/exams'); }}
                    className="flex flex-col items-center gap-1 p-1 hover:bg-gray-100 rounded-lg transition-colors" title="Marks"
                >
                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-md"><Edit3 size={14} /></div>
                    <span className="text-[9px] font-medium text-gray-500">Marks</span>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); navigate('/teacher/classes'); }}
                    className="flex flex-col items-center gap-1 p-1 hover:bg-gray-100 rounded-lg transition-colors group-hover:bg-indigo-50" title="View Class"
                >
                    <div className="p-1.5 bg-gray-100 text-gray-500 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors"><ArrowRight size={14} /></div>
                    <span className="text-[9px] font-medium text-gray-500 group-hover:text-indigo-700">View</span>
                </button>
            </div>
        </div>
    );
};

const SubjectAccordion = ({ subject, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 rounded-full bg-indigo-500"></div>
                    <div className="text-left">
                        <h3 className="text-sm font-bold text-gray-900">{subject.name}</h3>
                        <p className="text-xs text-gray-400">{subject.classCount} Classes • {subject.classes.reduce((acc, curr) => acc + curr.students, 0)} Students</p>
                    </div>
                </div>
                <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'text-gray-400'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="p-4 pt-0 space-y-2">
                            <div className="h-px w-full bg-gray-100 mb-4"></div>
                            {subject.classes.map(cls => (
                                <ClassCard key={cls.id} classData={cls} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubjectAccordion;
