
import React from 'react';

const ReportChart = ({ type, data, title }) => {

    // Mock Chart Visual (since we don't have a charting lib installed like Recharts yet)
    // In a real implementation, this would use Recharts or Chart.js

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center h-80 relative overflow-hidden">
            <h4 className="absolute top-4 left-4 font-bold text-gray-700">{title}</h4>

            {/* Mock Visuals based on type */}
            {type === 'BAR' && (
                <div className="flex items-end gap-8 h-48 w-full px-10 mt-6 border-b border-gray-200 pb-0">
                    {[65, 80, 45, 90, 75, 50, 85].map((h, i) => (
                        <div key={i} className="flex-1 group relative">
                            <div
                                className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all cursor-pointer relative"
                                style={{ height: `${h}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {h}% Performance
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {type === 'PIE' && (
                <div className="relative w-48 h-48 rounded-full border-[16px] border-indigo-100 border-t-indigo-500 border-r-indigo-400 rotate-45 group hover:scale-105 transition-transform">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <div className="text-3xl font-bold text-gray-800">86%</div>
                        <div className="text-xs text-gray-500 font-medium uppercase">Attendance</div>
                    </div>
                </div>
            )}

            {/* Legend Mock */}
            <div className="mt-4 flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Present / Pass</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-100 rounded-sm"></div> Absent / Fail</div>
            </div>

        </div>
    );
};

export default ReportChart;
