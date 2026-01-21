
import React from 'react';
import { Eye, FileText, CheckCircle, XCircle } from 'lucide-react';
import EmploymentTypeStatusBadge from './EmploymentTypeStatusBadge';

const EmploymentTypeTable = ({ types, onView }) => {

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 hidden md:block">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Type Name</th>
                            <th className="px-6 py-4 font-semibold">Contract Based</th>
                            <th className="px-6 py-4 font-semibold">Payroll</th>
                            <th className="px-6 py-4 font-semibold">Benefits</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {types.map((type) => (
                            <tr key={type.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{type.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium text-xs">
                                    {type.contractBased ? (
                                        <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded">Yes</span>
                                    ) : (
                                        <span className="text-gray-400">No</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {type.payrollEligible ? (
                                        <span className="text-green-600 flex items-center gap-1 font-bold"><CheckCircle size={14} /> Eligible</span>
                                    ) : (
                                        <span className="text-red-400 flex items-center gap-1"><XCircle size={14} /> Ineligible</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {type.benefitsEligible ? (
                                        <span className="text-indigo-600 font-bold">Enabled</span>
                                    ) : (
                                        <span className="text-gray-400">Disabled</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <EmploymentTypeStatusBadge status={type.status} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onView(type)}
                                        className="text-gray-400 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {types.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm">
                    No employment types defined.
                </div>
            )}
        </div>
    );
};

export default EmploymentTypeTable;
