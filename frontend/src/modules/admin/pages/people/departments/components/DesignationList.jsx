
import React from 'react';
import { User, Shield, AlertTriangle, Edit2 } from 'lucide-react';

const DesignationList = ({ designations, onEdit }) => {

    return (
        <div className="space-y-3">
            {designations.map((des) => (
                <div key={des.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:border-gray-200 hover:shadow-md transition-all group flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                            <User size={16} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">{des.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-500 font-mono bg-gray-50 px-1 rounded">{des.code}</span>
                                <span className="text-[10px] text-blue-600 font-bold">Level {des.level}</span>
                                {des.reportsTo && (
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        → Reports to {des.reportsTo}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="block text-xs font-bold text-gray-700">{des.employeeCount} Staff</span>
                            <span className={`text-[10px] uppercase font-bold ${des.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`}>{des.status}</span>
                        </div>
                        <button
                            onClick={() => onEdit(des)}
                            className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Edit2 size={16} />
                        </button>
                    </div>

                </div>
            ))}

            {designations.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
                    No designations defined for this department yet.
                </div>
            )}
        </div>
    );
};

export default DesignationList;
