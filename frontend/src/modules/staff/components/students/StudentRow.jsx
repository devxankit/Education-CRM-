
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Phone, FileText, IndianRupee, Bus } from 'lucide-react';
import { STAFF_ROLES } from '../../config/roles';

const StudentRow = ({ student, role }) => {
    const navigate = useNavigate();

    // Helper to render status badge
    const renderStatusBadge = (status) => {
        const styles = {
            'Active': 'bg-green-50 text-green-700 border-green-200',
            'Inactive': 'bg-gray-100 text-gray-600 border-gray-200',
        };
        const style = styles[status] || styles['Active'];
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${style}`}>
                {status}
            </span>
        );
    };

    const renderFeeBadge = (status) => {
        const styles = {
            'Paid': 'bg-emerald-50 text-emerald-700',
            'Due': 'bg-amber-50 text-amber-700',
            'Overdue': 'bg-red-50 text-red-700',
        };
        return <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${styles[status] || ''}`}>{status}</span>;
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors group">

            {/* 1. Basic Info (Always Visible) */}
            <td className="px-6 py-4">
                <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => navigate(`/staff/students/${student.id}`)}>
                        {student.name}
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{student.id}</p>
                </div>
            </td>

            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                {student.class}
            </td>

            <td className="px-6 py-4">
                {renderStatusBadge(student.status)}
            </td>

            {/* 2. Role Specific Data Cells */}

            {/* Contact - Front Desk, Data Entry, Transport */}
            {[STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.TRANSPORT].includes(role) && (
                <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span>{student.contact}</span>
                    </div>
                </td>
            )}

            {/* Fees - Accounts, Front Desk */}
            {[STAFF_ROLES.ACCOUNTS, STAFF_ROLES.FRONT_DESK].includes(role) && (
                <td className="px-6 py-4">
                    {renderFeeBadge(student.feeStatus)}
                </td>
            )}

            {/* Route - Transport */}
            {[STAFF_ROLES.TRANSPORT].includes(role) && (
                <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Bus size={14} className="text-gray-400" />
                        <span>{student.route}</span>
                    </div>
                </td>
            )}

            {/* Docs - Front Desk, Data Entry */}
            {[STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY].includes(role) && (
                <td className="px-6 py-4 text-sm">
                    <div className={`flex items-center gap-1.5 ${student.docsStatus === 'Verified' ? 'text-teal-600' : 'text-orange-600'}`}>
                        <FileText size={14} />
                        <span className="font-semibold text-xs">{student.docsStatus}</span>
                    </div>
                </td>
            )}

            {/* 3. Actions Column */}
            <td className="px-6 py-4 text-right">
                <button
                    onClick={() => navigate(`/staff/students/${student.id}`)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                    <MoreHorizontal size={18} />
                </button>
            </td>
        </tr>
    );
};

export default StudentRow;