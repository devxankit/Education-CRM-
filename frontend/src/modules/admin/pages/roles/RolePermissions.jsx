
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Layout, ShieldCheck, CheckSquare, Layers } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

import SavePermissionBar from './components/permissions/SavePermissionBar';
import ModulePermissionMatrix from './components/permissions/ModulePermissionMatrix';
import ActionPermissionPanel from './components/permissions/ActionPermissionPanel';

const RolePermissions = () => {
    // const { roleId } = useParams(); // In real app
    const navigate = useNavigate();
    const roleId = 'mock_id_1'; // Mock ID

    // State
    const [activeTab, setActiveTab] = useState('modules');
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock Permissions Data
    const [matrix, setMatrix] = useState({
        students: { view: true, create: true, edit: false, delete: false, export: true },
        teachers: { view: true, create: false, edit: false, delete: false, export: false },
        finance: { view: false, create: false, edit: false, delete: false, export: false }
        // ... others default to false/null
    });

    const [actions, setActions] = useState({
        fees_collect: { enabled: true, approvalRequired: true },
        doc_verify: { enabled: true, approvalRequired: false }
    });

    // Change Handlers
    const handleMatrixChange = (moduleKey, actionKey) => {
        setMatrix(prev => ({
            ...prev,
            [moduleKey]: {
                ...prev[moduleKey],
                [actionKey]: !prev[moduleKey]?.[actionKey]
            }
        }));
        setHasChanges(true);
    };

    const handleActionChange = (actionKey, field) => {
        setActions(prev => ({
            ...prev,
            [actionKey]: {
                ...prev[actionKey],
                [field]: !prev[actionKey]?.[field]
            }
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setHasChanges(false);
            alert("Permissions Policy Updated Successfully.");
        }, 800);
    };

    const handleReset = () => {
        // Reload logic mock
        if (window.confirm("Discard all unsaved changes and revert to last published state?")) {
            setHasChanges(false);
            // In real app, re-fetch API
            alert("Resetting...");
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`
                flex items-center gap-2 px-6 py-3 border-b-2 transition-colors font-medium text-sm
                ${activeTab === id
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
            `}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 relative">

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Permission Policy</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">ROLE_TEACHER</span>
                            <span>•</span>
                            <span>Editing Access Control Matrix</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Tabs */}
                <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 flex">
                    <TabButton id="modules" label="Module Access" icon={Layout} />
                    <TabButton id="actions" label="Workflow & Risk Actions" icon={ShieldCheck} />
                    <TabButton id="fields" label="Field Level Security" icon={Layers} />
                    <TabButton id="visibility" label="Data Scope" icon={CheckSquare} />
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-b-xl border border-gray-200 p-6 min-h-[400px]">

                    {activeTab === 'modules' && (
                        <ModulePermissionMatrix
                            permissions={matrix}
                            onChange={handleMatrixChange}
                        />
                    )}

                    {activeTab === 'actions' && (
                        <ActionPermissionPanel
                            permissions={actions}
                            onChange={handleActionChange}
                        />
                    )}

                    {activeTab === 'fields' && (
                        <div className="text-center py-20 bg-gray-50 rounded border border-dashed border-gray-300">
                            <Layers className="mx-auto text-gray-300 mb-2" size={32} />
                            <h3 className="text-gray-900 font-medium">Field Security Profile</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                                Granular field-level visibility rules are configured in the Schema Validator module.
                                (Future Implementation)
                            </p>
                        </div>
                    )}

                    {/* Other tabs can be placeholders or implemented similarly */}
                </div>
            </div>

            {/* Sticky Save Bar */}
            <SavePermissionBar
                hasChanges={hasChanges}
                onSave={handleSave}
                onReset={handleReset}
                loading={loading}
            />
        </div>
    );
};

export default RolePermissions;
