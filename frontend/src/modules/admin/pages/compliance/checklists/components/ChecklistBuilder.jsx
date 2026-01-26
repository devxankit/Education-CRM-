import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, CheckSquare, FileText, Calendar } from 'lucide-react';

const ChecklistBuilder = ({ checklist, onClose, onSave }) => {

    const [items, setItems] = useState(checklist?.items || []);
    const [newItem, setNewItem] = useState({ label: '', type: 'checkbox', required: true });

    const handleAddItem = () => {
        if (!newItem.label.trim()) return;
        setItems([...items, { ...newItem, id: Date.now() }]);
        setNewItem({ label: '', type: 'checkbox', required: true });
    };

    const handleRemoveItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const handleSave = () => {
        onSave({ ...checklist, items });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Edit Checklist Items</h3>
                        <p className="text-sm text-gray-500">{checklist.title}</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-700 transition-colors"
                    >
                        Save & Close
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Add New Item */}
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase mb-3">Add New Requirement</h4>
                        <div className="flex flex-col md:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Requirement description (e.g. Upload Aadhar Card)"
                                className="flex-1 px-3 py-2 border border-indigo-200 rounded text-sm focus:outline-none focus:border-indigo-500"
                                value={newItem.label}
                                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                            />
                            <select
                                className="px-3 py-2 border border-indigo-200 rounded text-sm bg-white focus:outline-none focus:border-indigo-500"
                                value={newItem.type}
                                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                            >
                                <option value="checkbox">To-Do Item</option>
                                <option value="document">Document Upload</option>
                                <option value="date">Date Verification</option>
                            </select>
                            <label className="flex items-center gap-2 px-3 border border-indigo-200 rounded bg-white cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newItem.required}
                                    onChange={(e) => setNewItem({ ...newItem, required: e.target.checked })}
                                    className="rounded text-indigo-600"
                                />
                                <span className="text-xs font-medium text-gray-600">Required</span>
                            </label>
                            <button
                                onClick={handleAddItem}
                                className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                        {items.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No items yet. Add one above.
                            </div>
                        )}
                        {items.map((item, idx) => (
                            <div key={item.id} className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded shadow-sm hover:border-gray-300 transition-colors">
                                <GripVertical size={16} className="text-gray-300 cursor-move" />
                                <div className="p-2 bg-gray-50 rounded text-gray-500">
                                    {item.type === 'document' && <FileText size={16} />}
                                    {item.type === 'checkbox' && <CheckSquare size={16} />}
                                    {item.type === 'date' && <Calendar size={16} />}
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">{item.label}</div>
                                    <div className="flex gap-2 text-xs">
                                        <span className="text-gray-500 capitalize">{item.type}</span>
                                        {item.required && <span className="text-red-500 font-medium">• Mandatory</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-2 text-gray-300 hover:text-red-600 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ChecklistBuilder;
