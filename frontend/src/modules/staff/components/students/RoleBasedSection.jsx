
import React from 'react';
import { Pencil, Upload, Eye, Bus, Ticket, Shield } from 'lucide-react';
import { STAFF_ROLES } from '../../config/roles';

const RoleBasedSection = ({ title, role, allowedRoles, children, onEdit, editable }) => {
    // 1. Permission Check
    if (!allowedRoles.includes(role)) {
        return null;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 relative group">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                {editable && (
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Section"
                    >
                        <Pencil size={18} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {children}
            </div>
        </div>
    );
};

export default RoleBasedSection;
