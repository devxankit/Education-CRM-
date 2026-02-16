import React from 'react';
import { motion } from 'framer-motion';
import { Video, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const TodayClasses = ({ classes = [] }) => {
    const list = Array.isArray(classes) ? classes : [];
    return (
        <div className="px-4 py-4 max-w-md mx-auto">
            <div className="flex justify-between items-end mb-3">
                <h2 className="text-lg font-bold text-gray-800">Today's Classes</h2>
                <Link to="/student/academics" className="text-xs font-semibold text-primary cursor-pointer hover:underline">View Timetable</Link>
            </div>

            <div className="space-y-3 relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-indigo-50"></div>

                {list.length > 0 ? (
                    list.map((cls, index) => (
                        <motion.div
                            key={cls.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="relative flex gap-4 p-3 rounded-xl bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow"
                        >
                            <div className={`relative z-10 w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${index === 0 ? 'bg-primary ring-4 ring-purple-100' : 'bg-gray-300'
                                }`}></div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{cls.subject || 'Class'}</h3>
                                        <p className="text-xs text-gray-500">{cls.teacher || '—'}</p>
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-purple-50 px-2 py-0.5 rounded text-nowrap">
                                        {cls.time || '—'}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-3">
                                    {(cls.mode || cls.type) === 'online' ? (
                                        <div className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                                            <Video size={12} /> Live Class
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                                            <MapPin size={12} /> {cls.room ? `Room ${cls.room}` : 'Room —'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm">No classes scheduled today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayClasses;
