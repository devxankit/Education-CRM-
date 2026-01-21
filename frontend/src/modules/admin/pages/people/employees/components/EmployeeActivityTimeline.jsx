
import React from 'react';
import { Circle, UserCheck, AlertOctagon, UserX, Clock, FileText } from 'lucide-react';

const EmployeeActivityTimeline = ({ history }) => {

    // history: Array of { date, action, user, notes }

    return (
        <div className="border-l-2 border-gray-100 ml-3 space-y-6 py-2">
            {history.map((event, index) => (
                <div key={index} className="relative pl-6">
                    {/* Icon Bubble */}
                    <div className="absolute -left-[9px] top-0 bg-white">
                        {event.action.includes('Created') && <UserCheck size={16} className="text-green-500" />}
                        {event.action.includes('Role') && <Circle size={16} className="text-blue-500 fill-blue-50" />}
                        {event.action.includes('Suspended') && <AlertOctagon size={16} className="text-orange-500" />}
                        {event.action.includes('Exit') && <UserX size={16} className="text-red-500" />}
                        {event.action.includes('Document') && <FileText size={16} className="text-gray-500" />}
                        {!event.action.match(/Created|Role|Suspended|Exit|Document/) && <Clock size={16} className="text-gray-300" />}
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">{event.action}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{event.date} • by {event.user}</span>
                        {event.notes && (
                            <p className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded border border-gray-100 italic">
                                "{event.notes}"
                            </p>
                        )}
                    </div>
                </div>
            ))}

            {history.length === 0 && (
                <div className="pl-6 text-xs text-gray-400 italic">No activity history found.</div>
            )}
        </div>
    );
};

export default EmployeeActivityTimeline;
