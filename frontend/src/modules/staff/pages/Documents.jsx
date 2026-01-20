import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Search, Folder, FileText, CheckCircle, AlertCircle, Clock, Filter, ChevronRight, Eye } from 'lucide-react';

// --- MOCK DOCUMENTS DATA ---
// Consolidated overview of entities and their document status
const MOCK_DOCS_OVERVIEW = [
    { id: 'DOC-S-001', entityId: 'STU-2024-001', name: 'Aarav Patel', type: 'Student', required: 4, uploaded: 3, verified: 2, status: 'Pending' },
    { id: 'DOC-T-001', entityId: 'TCH-001', name: 'Suresh Kumar', type: 'Teacher', required: 3, uploaded: 3, verified: 3, status: 'Complete' },
    { id: 'DOC-E-001', entityId: 'EMP-D-101', name: 'Ramesh Singh', type: 'Employee', required: 4, uploaded: 2, verified: 1, status: 'Rejected' },
    { id: 'DOC-S-002', entityId: 'STU-2024-002', name: 'Zara Khan', type: 'Student', required: 4, uploaded: 0, verified: 0, status: 'Pending' },
    { id: 'DOC-V-001', entityId: 'V-001', name: 'City Fuels', type: 'Vendor', required: 3, uploaded: 3, verified: 0, status: 'Review' },
];

const Documents = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Access Check: Transport NO ACCESS
    if (user?.role === STAFF_ROLES.TRANSPORT) {
        return <AccessDenied />;
    }

    // Filter Logic
    const filteredDocs = MOCK_DOCS_OVERVIEW.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.entityId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || item.type === filterType;
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Complete': return 'bg-green-50 text-green-700 border-green-200';
            case 'Pending': return 'bg-gray-50 text-gray-600 border-gray-200';
            case 'Review': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-3 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Document Compliance</h1>
                        <p className="text-xs text-gray-500">Centralized audit & verification system</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                        >
                            <option value="All">All Entities</option>
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Employee">Employee</option>
                            <option value="Vendor">Vendor</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 bg-gray-100 text-sm font-bold text-gray-600 rounded-lg border-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                        >
                            <option value="All">All Status</option>
                            <option value="Complete">Complete</option>
                            <option value="Pending">Pending</option>
                            <option value="Review">In Review</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="p-4 md:p-6 space-y-4">
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Entity Details</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-center">Progress</th>
                                <th className="px-6 py-4">Compliance Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredDocs.map(doc => (
                                <tr
                                    key={doc.id}
                                    onClick={() => navigate(`/staff/documents/${doc.type.toLowerCase()}/${doc.entityId}`)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <Folder size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                                                <p className="text-xs text-gray-500 font-mono">{doc.entityId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{doc.type}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-gray-700 mb-1">{doc.uploaded}/{doc.required} Uploaded</span>
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${(doc.uploaded / doc.required) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1">{doc.verified} Verified</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(doc.status)}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 font-bold text-xs flex items-center gap-1 ml-auto">
                                            View <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                    {filteredDocs.map(doc => (
                        <div
                            key={doc.id}
                            onClick={() => navigate(`/staff/documents/${doc.type.toLowerCase()}/${doc.entityId}`)}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{doc.name}</h3>
                                        <p className="text-xs text-gray-500">{doc.entityId} • {doc.type}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(doc.status)}`}>
                                    {doc.status}
                                </span>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                                <span className="font-bold text-gray-500">Progress</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-indigo-600 font-bold">{doc.uploaded}/{doc.required} Uploaded</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-green-600 font-bold">{doc.verified} Verified</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gray-50">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400"><AlertCircle size={32} /></div>
        <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-500 mt-2">You do not have permission to access compliance documents.</p>
    </div>
);

export default Documents;
