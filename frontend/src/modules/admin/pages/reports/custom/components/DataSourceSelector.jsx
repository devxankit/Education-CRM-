import React from 'react';
import {
    Users,
    Banknote,
    CalendarCheck,
    GraduationCap,
    Bus,
    Box,
    Headphones
} from 'lucide-react';

const sources = [
    { id: 'students', label: 'Students', icon: Users, desc: 'Personal details, demographics, and status' },
    { id: 'fees', label: 'Fee Transactions', icon: Banknote, desc: 'Collections, pending dues, and discounts' },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, desc: 'Daily logs, leave records, and trends' },
    { id: 'exams', label: 'Academic Results', icon: GraduationCap, desc: 'Marks, grades, and exam schedules' },
    { id: 'employees', label: 'Staff & Payroll', icon: Users, desc: 'Employee data, roles, and payroll costs', restricted: true },
    { id: 'transport', label: 'Transport', icon: Bus, desc: 'Routes, bus occupancy, and fleet logs' },
    { id: 'assets', label: 'Assets', icon: Box, desc: 'Inventory stock and asset assignments' },
    { id: 'support', label: 'Support', icon: Headphones, desc: 'Ticket history and resolution SLAs' }
];

const DataSourceSelector = ({ selectedSource, onSelect }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Select Primary Data Source</h3>
            <p className="text-sm text-gray-500">Choose the main entity for your report. Cross-entity joins (e.g., Student + Fees) are handled automatically based on this selection.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {sources.map((source) => {
                    const Icon = source.icon;
                    const isSelected = selectedSource === source.id;

                    return (
                        <div
                            key={source.id}
                            onClick={() => onSelect(source.id)}
                            className={`
                                cursor-pointer p-5 rounded-xl border-2 transition-all hover:shadow-md
                                ${isSelected
                                    ? 'border-indigo-600 bg-indigo-50/50'
                                    : 'border-gray-200 bg-white hover:border-indigo-200'
                                }
                            `}
                        >
                            <div className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                <Icon size={24} />
                            </div>
                            <h4 className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>{source.label}</h4>
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{source.desc}</p>

                            {source.restricted && (
                                <span className="inline-block mt-3 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded border border-red-100">
                                    Restricted Data
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DataSourceSelector;
