
import React, { useState } from 'react';
import { Clock, BarChart } from 'lucide-react';

const SLARulesPanel = ({ isLocked }) => {

    // SLA Configuration (Hours)
    const [sla, setSla] = useState([
        { priority: 'critical', response: 0.5, resolution: 4 },
        { priority: 'high', response: 2, resolution: 12 },
        { priority: 'medium', response: 6, resolution: 24 },
        { priority: 'low', response: 24, resolution: 72 }
    ]);

    const handleChange = (priority, field, value) => {
        if (isLocked) return;
        setSla(prev => prev.map(s => s.priority === priority ? { ...s, [field]: Number(value) } : s));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <Clock className="text-amber-600" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-gray-900">SLA Timers</h3>
                    <p className="text-xs text-gray-500">Service Level Agreement targets (in Hours).</p>
                </div>
            </div>

            <div className="p-4">
                <table className="w-full text-left">
                    <thead className="text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
                        <tr>
                            <th className="py-2 pl-2">Priority</th>
                            <th className="py-2 text-center">First Resp. (Hr)</th>
                            <th className="py-2 text-center">Resolution (Hr)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {sla.map((s) => (
                            <tr key={s.priority} className="group hover:bg-gray-50">
                                <td className="py-3 pl-2">
                                    <span className={`text-xs font-bold capitalize ${s.priority === 'critical' ? 'text-red-600' :
                                            s.priority === 'high' ? 'text-orange-600' : 'text-gray-600'
                                        }`}>
                                        {s.priority}
                                    </span>
                                </td>
                                <td className="py-3 text-center">
                                    <input
                                        type="number"
                                        min="0.1" step="0.5"
                                        value={s.response}
                                        onChange={(e) => handleChange(s.priority, 'response', e.target.value)}
                                        disabled={isLocked}
                                        className="w-16 text-center text-sm font-medium bg-gray-50 border border-gray-200 rounded py-1 focus:ring-1 focus:ring-amber-500 outline-none"
                                    />
                                </td>
                                <td className="py-3 text-center">
                                    <input
                                        type="number"
                                        min="1"
                                        value={s.resolution}
                                        onChange={(e) => handleChange(s.priority, 'resolution', e.target.value)}
                                        disabled={isLocked}
                                        className="w-16 text-center text-sm font-medium bg-gray-50 border border-gray-200 rounded py-1 focus:ring-1 focus:ring-amber-500 outline-none"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="mt-4 text-[10px] text-gray-400 italic text-center">
                    Timers run 24/7 unless "Business Hours Only" is configured in Global Settings.
                </p>
            </div>
        </div>
    );
};

export default SLARulesPanel;
