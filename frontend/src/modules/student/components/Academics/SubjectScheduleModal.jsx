import React from 'react';
import { motion } from 'framer-motion';
import { X, Clock, MapPin, Calendar } from 'lucide-react';

/**
 * Shows which days & times a subject's classes are scheduled
 */
const SubjectScheduleModal = ({ subject, timetable, onClose }) => {
    if (!subject || !timetable) return null;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const slots = [];

    const subjId = subject.subjectId?._id?.toString?.() || subject.subjectId?.toString?.() || '';
    const subjName = (subject.name || '').trim().toLowerCase();

    days.forEach(day => {
        const daySlots = timetable[day] || [];
        daySlots.forEach(slot => {
            const slotId = slot.subjectId?.toString?.() || '';
            const slotSubj = (slot.subject || '').trim().toLowerCase();
            const matchById = subjId && slotId && subjId === slotId;
            const matchByName = slotSubj && subjName && slotSubj === subjName;
            if (matchById || matchByName) {
                slots.push({
                    day,
                    time: slot.time,
                    room: slot.room || 'N/A',
                    teacher: slot.teacher
                });
            }
        });
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{subject.name}</h2>
                        <p className="text-xs text-gray-500">Class Schedule</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    {subject.teacher && (
                        <p className="text-sm text-gray-600 mb-4">
                            <span className="font-medium">Teacher:</span> {subject.teacher}
                        </p>
                    )}

                    {slots.length > 0 ? (
                        <>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Weekly Schedule ({slots.length} classes)
                            </h3>
                            <div className="space-y-3">
                                {slots.map((slot, idx) => (
                                    <div
                                        key={`${slot.day}_${idx}`}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
                                    >
                                        <div className="flex items-center gap-2 min-w-[70px]">
                                            <Calendar size={16} className="text-purple-500 shrink-0" />
                                            <span className="font-bold text-gray-900">{slot.day}</span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-1">
                                            <Clock size={16} className="text-gray-400 shrink-0" />
                                            <span className="text-sm text-gray-700">{slot.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <MapPin size={14} className="text-gray-400" />
                                            <span className="text-xs text-gray-600">Room {slot.room}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-sm text-gray-500">No schedule found for this subject.</p>
                            <p className="text-xs text-gray-400 mt-1">Timetable may not be set for your class yet.</p>
                            <p className="text-[10px] text-gray-400 mt-2">Ask your admin to add the weekly timetable.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SubjectScheduleModal;
