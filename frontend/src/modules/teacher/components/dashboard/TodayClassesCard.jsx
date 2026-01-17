import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TodayClassesCard = ({ classes }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Today's Schedule</h3>
            <div className="grid gap-3">
                {classes.length > 0 ? (
                    classes.map((cls, idx) => (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            key={cls.id}
                            onClick={() => navigate(`/teacher/classes`)} // In real app, /teacher/classes/${cls.id}
                            className={`bg-white p-4 rounded-xl border ${cls.status === 'Pending' ? 'border-orange-200 bg-orange-50/10' : 'border-gray-100'} shadow-sm flex items-center justify-between group active:scale-[0.99] transition-all cursor-pointer`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-nowrap">
                                        {cls.classSection}
                                    </span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${cls.status === 'Marked' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                                        {cls.status === 'Marked' ? <><CheckCircle size={10} /> Marked</> : <><AlertCircle size={10} /> Pending</>}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-800 truncate">{cls.subject}</h4>
                                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 font-medium">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {cls.time}</span>
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {cls.room}</span>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (cls.status === 'Pending') navigate('/teacher/attendance');
                                    else navigate(`/teacher/classes`);
                                }}
                                className={`ml-3 px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap
                                    ${cls.status === 'Pending'
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {cls.status === 'Pending' ? 'Mark Attendance' : 'View Class'}
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500">No classes scheduled for today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayClassesCard;
