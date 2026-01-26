import React from 'react';
import { Plus, Trash2, Filter } from 'lucide-react';

const OPERATORS = [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'between', label: 'Between' },
    { value: 'starts_with', label: 'Starts With' }
];

const FilterBuilder = ({ filters, fields, onUpdate }) => {

    const addFilter = () => {
        onUpdate([...filters, { field: '', operator: 'equals', value: '' }]);
    };

    const removeFilter = (index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        onUpdate(newFilters);
    };

    const updateFilterStep = (index, key, val) => {
        const newFilters = [...filters];
        newFilters[index][key] = val;
        onUpdate(newFilters);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Filter Logic</h3>
                <p className="text-sm text-gray-500">Refine your dataset. Rows must match ALL conditions (AND logic) by default.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[200px]">
                {filters.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <Filter className="mx-auto mb-3 opacity-20" size={48} />
                        <p>No filters applied. The report will return all records.</p>
                        <button
                            onClick={addFilter}
                            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                        >
                            + Add your first condition
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filters.map((filter, index) => (
                            <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded border border-gray-200 group">
                                <span className="text-xs font-bold text-gray-400 uppercase w-8 text-center">
                                    {index === 0 ? 'WHERE' : 'AND'}
                                </span>

                                {/* Field Select */}
                                <select
                                    className="px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 w-1/3"
                                    value={filter.field}
                                    onChange={(e) => updateFilterStep(index, 'field', e.target.value)}
                                >
                                    <option value="" disabled>Select Field...</option>
                                    {fields.map(f => (
                                        <option key={f} value={f}>{f}</option> // Simple mockup, ideally use field labels
                                    ))}
                                </select>

                                {/* Operator Select */}
                                <select
                                    className="px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 w-1/4"
                                    value={filter.operator}
                                    onChange={(e) => updateFilterStep(index, 'operator', e.target.value)}
                                >
                                    {OPERATORS.map(op => (
                                        <option key={op.value} value={op.value}>{op.label}</option>
                                    ))}
                                </select>

                                {/* Value Input */}
                                <input
                                    type="text"
                                    className="px-3 py-2 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-500 flex-1"
                                    placeholder="Value..."
                                    value={filter.value}
                                    onChange={(e) => updateFilterStep(index, 'value', e.target.value)}
                                />

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeFilter(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addFilter}
                            className="flex items-center gap-2 mt-4 px-4 py-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors font-medium"
                        >
                            <Plus size={16} /> Add Condition
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBuilder;
