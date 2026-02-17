
import React, { useState, useEffect } from 'react';
import { Search, Filter, Archive, ChevronRight, DollarSign, FileText } from 'lucide-react';
import FeeStructureStatusBadge from './FeeStructureStatusBadge';

const computeTotalWithTax = (baseAmount, applicableTaxes) => {
    if (!baseAmount || !applicableTaxes?.length) return baseAmount;
    let tax = 0;
    applicableTaxes.forEach(t => {
        tax += t.type === 'percentage' ? (baseAmount * (Number(t.rate) || 0)) / 100 : Number(t.rate) || 0;
    });
    return baseAmount + tax;
};

const FeeStructureList = ({ structures, selectedId, onSelect, onFilterChange, academicYears = [], branches = [], searchValue = '', selectedBranchId = '', applicableTaxes = [] }) => {
    const [localSearch, setLocalSearch] = useState(searchValue);

    useEffect(() => {
        setLocalSearch(searchValue);
    }, [searchValue]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalSearch(value);
        onFilterChange('search', value);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-['Inter'] animate-in fade-in slide-in-from-left-4 duration-300">

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 shrink-0 bg-gradient-to-b from-gray-50 to-white">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or year..."
                        value={localSearch}
                        onChange={handleSearchChange}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>

                {/* Filters Grid */}
                <div className="flex flex-col gap-2">
                    {branches.length > 0 && (
                        <select
                            value={selectedBranchId || ''}
                            onChange={(e) => onFilterChange('branchId', e.target.value)}
                            className="w-full text-[11px] font-bold border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-600 outline-none cursor-pointer focus:border-indigo-500 transition-colors uppercase tracking-wider"
                        >
                            <option value="">All Branches</option>
                            {branches.map(branch => (
                                <option key={branch._id} value={branch._id}>{branch.name}</option>
                            ))}
                        </select>
                    )}

                  
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {structures.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <FileText size={32} className="text-gray-300 mb-2" />
                        <p className="text-sm font-medium">No fee structures found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {structures.map((item) => {
                            const id = item._id || item.id;
                            const isSelected = selectedId === id;
                            const itemBranchId = item.branchId?._id || item.branchId;
                            const baseAmount = item.totalAmount || 0;
                            const totalWithTax = (applicableTaxes.length > 0 && itemBranchId === selectedBranchId)
                                ? computeTotalWithTax(baseAmount, applicableTaxes) : baseAmount;
                            const showTax = applicableTaxes.length > 0 && itemBranchId === selectedBranchId && totalWithTax !== baseAmount;
                            return (
                                <div
                                    key={id}
                                    onClick={() => onSelect(item)}
                                    className={`
                                        p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200 group relative
                                        ${isSelected ? 'bg-indigo-50 border-l-4 border-l-indigo-600 shadow-sm' : 'hover:border-l-2 hover:border-l-gray-200'}
                                        animate-in fade-in slide-in-from-left-2 duration-200
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-semibold text-sm leading-tight ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                                            {item.name}
                                        </h4>
                                        <FeeStructureStatusBadge status={item.status} />
                                    </div>

                                    <div className="flex justify-between items-end text-xs text-gray-500">
                                        <div className="space-y-1">
                                            <p className="flex items-center gap-1">
                                                <span className="font-medium">{item.academicYearId?.name || 'N/A'}</span>
                                                <span>•</span>
                                                <span>{item.applicableClasses?.length || 0} Classes</span>
                                                {item.applicableCourses?.length > 0 && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{item.applicableCourses?.length} Programs</span>
                                                    </>
                                                )}
                                            </p>
                                            <p className="flex items-center gap-1 font-mono text-gray-700 font-semibold">
                                                <DollarSign size={12} className="text-indigo-500" /> 
                                                ₹{totalWithTax.toLocaleString()}
                                                {showTax && <span className="text-[10px] font-normal text-gray-500">(incl. tax)</span>}
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className={`text-gray-300 transition-transform group-hover:translate-x-1 ${isSelected ? 'text-indigo-500' : ''}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeeStructureList;
