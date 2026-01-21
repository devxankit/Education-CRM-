
import React from 'react';
import { X, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import ExpenseCategoryForm from './ExpenseCategoryForm';

const CategoryDetailDrawer = ({ isOpen, onClose, category, onSave }) => {

    if (!isOpen) return null;

    // Mock Metrics (random for demo)
    const metrics = category ? {
        totalLifetime: 450000,
        currentMonth: 12500,
        utilization: Math.floor((12500 / (category.budgetLimit || 20000)) * 100)
    } : null;

    return (
        <div className="fixed inset-y-0 right-0 w-full lg:w-1/3 xl:w-1/4 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col">

            {/* Drawer Header (Shared with Form or Separate?) -> Let's keep a minimal handle here */}
            {/* The Form has its own header, but we might want to overlay metrics first */}

            {category && (
                <div className="bg-indigo-900 p-6 text-white shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-bold">{category.name}</h2>
                            <p className="text-indigo-300 text-xs font-mono">{category.code}</p>
                        </div>
                        <button onClick={onClose} className="text-indigo-300 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/10 p-2 rounded text-center">
                            <div className="flex justify-center mb-1 text-indigo-300"><DollarSign size={14} /></div>
                            <div className="text-sm font-bold block">${(metrics.currentMonth / 1000).toFixed(1)}k</div>
                            <div className="text-[9px] text-indigo-200 uppercase">This Month</div>
                        </div>
                        <div className="bg-white/10 p-2 rounded text-center">
                            <div className="flex justify-center mb-1 text-indigo-300"><TrendingUp size={14} /></div>
                            <div className="text-sm font-bold block">${(metrics.totalLifetime / 1000).toFixed(0)}k</div>
                            <div className="text-[9px] text-indigo-200 uppercase">Lifetime</div>
                        </div>
                        <div className="bg-white/10 p-2 rounded text-center">
                            <div className="flex justify-center mb-1 text-indigo-300"><PieChart size={14} /></div>
                            <div className={`text-sm font-bold block ${metrics.utilization > 90 ? 'text-red-300' : 'text-white'}`}>
                                {metrics.utilization}%
                            </div>
                            <div className="text-[9px] text-indigo-200 uppercase">Budget Used</div>
                        </div>
                    </div>
                </div>
            )}

            {!category && (
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="font-bold text-gray-800">New Expense Category</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                <ExpenseCategoryForm
                    category={category}
                    onSave={onSave}
                    onCancel={onClose}
                    embedded={true} // Prop to tell form to hide its own header if needed
                />
            </div>

        </div>
    );
};

export default CategoryDetailDrawer;
