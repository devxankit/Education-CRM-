import React from 'react';
import {
    CreditCard,
    AlertCircle,
    TrendingUp,
    Percent,
    FileText,
    ChevronRight,
    Wallet
} from 'lucide-react';

const categories = [
    { id: 'collection', label: 'Fee Collection', icon: Wallet, desc: 'Daily logs, modes & trends' },
    { id: 'dues', label: 'Outstanding Dues', icon: AlertCircle, desc: 'Defaulters & aging reports' },
    { id: 'expenses', label: 'Expense Analysis', icon: TrendingUp, desc: 'Operational costs & burn rate' },
    { id: 'discounts', label: 'Concessions', icon: Percent, desc: 'Scholarships & waivers' },
    { id: 'dcr', label: 'Daily Collection (DCR)', icon: FileText, desc: 'Accountant daily summary' }
];

const FinanceReportSidebar = ({ activeCategory, onSelect }) => {
    return (
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Financial Insights</h3>
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
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <Icon
                                size={18}
                                className={`mt-0.5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                            />
                            <div className="flex-1">
                                <span className="text-sm font-medium block">{cat.label}</span>
                                <span className={`text-xs block mt-0.5 ${isActive ? 'text-emerald-600/80' : 'text-gray-400'}`}>
                                    {cat.desc}
                                </span>
                            </div>
                            {isActive && <ChevronRight size={16} className="text-emerald-400 mt-1" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Total Collection (Today)</p>
                    <p className="text-lg font-bold text-emerald-600">₹ 2,45,000</p>
                </div>
            </div>
        </div>
    );
};

export default FinanceReportSidebar;
