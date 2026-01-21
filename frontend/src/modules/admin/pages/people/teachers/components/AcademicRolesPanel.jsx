
import React from 'react';
import { Award, Shield } from 'lucide-react';

const AcademicRolesPanel = ({ roles }) => {

    // roles: Array of { role: 'Class Teacher', scope: 'Class 5-A', year: '2024-25' }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Shield className="text-purple-600" size={20} />
                <h3 className="font-bold text-gray-800 text-sm">Academic Roles</h3>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 border border-purple-100 bg-purple-50/30 rounded-lg">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
                                <Award size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-800">{role.role}</h4>
                                <p className="text-xs text-gray-600">{role.scope}</p>
                                <span className="text-[10px] text-gray-400 font-mono mt-1 block">Session: {role.year}</span>
                            </div>
                        </div>
                    ))}
                    {roles.length === 0 && <p className="text-xs text-gray-400 italic">No special academic roles assigned.</p>}
                </div>
            </div>
        </div>
    );
};

export default AcademicRolesPanel;
