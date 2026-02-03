
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
        <div className="fixed inset-y-0 right-0 w-full lg:w-1/3 xl:w-1/4 bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] z-50 transform transition-transform duration-500 ease-out border-l border-gray-100 flex flex-col font-['Inter']">

            {category && (
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 p-8 text-white shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">{category.name}</h2>
                            <p className="text-indigo-300 text-[10px] font-bold font-mono tracking-widest uppercase mt-1 px-2 py-0.5 bg-white/10 rounded w-fit">{category.code}</p>
                        </div>
                        <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg hover:bg-white/20">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl text-center border border-white/10 shadow-lg">
                            <div className="text-indigo-300 mb-1 flex justify-center uppercase text-[8px] font-bold tracking-[0.1em]">This Month</div>
                            <div className="text-sm font-bold block">₹{(metrics.currentMonth / 1000).toFixed(1)}k</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl text-center border border-white/10 shadow-lg">
                            <div className="text-indigo-300 mb-1 flex justify-center uppercase text-[8px] font-bold tracking-[0.1em]">Lifetime</div>
                            <div className="text-sm font-bold block">₹{(metrics.totalLifetime / 1000).toFixed(0)}k</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl text-center border border-white/10 shadow-lg">
                            <div className="text-indigo-300 mb-1 flex justify-center uppercase text-[8px] font-bold tracking-[0.1em]">Utilization</div>
                            <div className={`text-sm font-bold block ${metrics.utilization > 90 ? 'text-rose-300' : 'text-emerald-300'}`}>
                                {metrics.utilization}%
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!category && (
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg tracking-tight">Create Category</h2>
                        <p className="text-xs text-gray-400">Add a new expense classification</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto relative scrollbar-none shadow-inner bg-white">
                <ExpenseCategoryForm
                    category={category}
                    onSave={onSave}
                    onCancel={onClose}
                    embedded={true}
                />
            </div>

        </div>
    );
};

export default CategoryDetailDrawer;
