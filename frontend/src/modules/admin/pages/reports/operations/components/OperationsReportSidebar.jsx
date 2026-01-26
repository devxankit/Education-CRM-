import React from 'react';
import {
    Bus,
    BedDouble,
    Box,
    FileText,
    HeadphonesIcon,
    ChevronRight,
    Activity
} from 'lucide-react';

const categories = [
    { id: 'transport', label: 'Transport & Fleet', icon: Bus, desc: 'Routes, occupancy & efficiency' },
    { id: 'hostel', label: 'Hostel & Housing', icon: BedDouble, desc: 'Occupancy, rooms & attendance' },
    { id: 'assets', label: 'Asset & Inventory', icon: Box, desc: 'Stock levels, valuation & tracking' },
    { id: 'compliance', label: 'Docs & Compliance', icon: FileText, desc: 'Verification status & gaps' },
    { id: 'support', label: 'Helpdesk & Support', icon: HeadphonesIcon, desc: 'Tickets, SLA & resolution' }
];

const OperationsReportSidebar = ({ activeCategory, onSelect }) => {
    return (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Operations Intel</h3>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const Icon = cat.icon;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelect(cat.id)}
                            className={`
                                w-full flex items-start text-left gap-3 px-3 py-3 rounded-lg transition-colors group
                                ${isActive
                                    ? 'bg-orange-50 text-orange-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <Icon
                                size={18}
                                className={`mt-0.5 shrink-0 ${isActive ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium block">{cat.label}</span>
                                <span className={`text-xs block mt-0.5 ${isActive ? 'text-orange-600/80' : 'text-gray-400'}`}>
                                    {cat.desc}
                                </span>
                            </div>
                            {isActive && <ChevronRight size={16} className="text-orange-400 mt-1" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="bg-white p-3 rounded border border-gray-200 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-full">
                        <Activity size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">System Status</p>
                        <p className="text-xs font-bold text-green-600">All Operations Normal</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationsReportSidebar;
