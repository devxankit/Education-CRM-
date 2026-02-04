
import React, { useState } from 'react';
import { Tag, AlertCircle, Plus, Trash2 } from 'lucide-react';

const TicketCategoryPanel = ({ isLocked, categories = [], onChange }) => {

    const handleAdd = () => {
        if (isLocked) return;
        const name = prompt("Enter new category name:");
        if (name) {
            onChange([...categories, { name, priority: 'medium', active: true }]);
        }
    };

    const handleRemove = (index) => {
        if (isLocked) return;
        onChange(categories.filter((_, i) => i !== index));
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'critical': return 'text-red-600 bg-red-50 border-red-100';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'medium': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Tag className="text-indigo-600" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Ticket Categories</h3>
                        <p className="text-xs text-gray-500">Classify issues & default priorities.</p>
                    </div>
                </div>
                {!isLocked && (
                    <button
                        onClick={handleAdd}
                        className="p-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {categories.map((cat, index) => (
                    <div key={cat._id || index} className="flex items-center justify-between p-2.5 border border-gray-100 rounded hover:bg-gray-50 group">
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getPriorityColor(cat.priority)}`}>
                                {cat.priority}
                            </span>
                            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                        </div>

                        {!isLocked ? (
                            <button onClick={() => handleRemove(index)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 size={14} />
                            </button>
                        ) : (
                            <div className="w-4"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketCategoryPanel;
