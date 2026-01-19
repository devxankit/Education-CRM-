
import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { Search, Filter, Shield, Eye, CheckCircle, XCircle, FileText, ChevronRight, Upload, AlertTriangle, ArrowLeft } from 'lucide-react';

// MOCK DATA
const STUDENTS_DOCS = [
    {
        id: '1', studentId: 'ST-2024-001', name: 'Aarav Gupta', class: '10-A',
        completion: 75,
        status: 'Pending Verification',
        documents: [
            { id: 101, name: 'Birth Certificate', status: 'Verified', url: '#', date: '2024-01-10' },
            { id: 102, name: 'Aadhar Card', status: 'Pending', url: 'https://via.placeholder.com/400x500.png?text=Aadhar+Preview', date: '2024-01-15' },
            { id: 103, name: 'Transfer Certificate', status: 'Missing', url: null, date: null },
            { id: 104, name: 'Previous Marksheet', status: 'Verified', url: '#', date: '2024-01-12' }
        ]
    },
    {
        id: '2', studentId: 'ST-2024-002', name: 'Zara Khan', class: '8-B',
        completion: 100,
        status: 'Verified',
        documents: [
            { id: 201, name: 'Birth Certificate', status: 'Verified', url: '#', date: '2024-01-05' },
            { id: 202, name: 'Aadhar Card', status: 'Verified', url: '#', date: '2024-01-05' },
            { id: 203, name: 'Transfer Certificate', status: 'Verified', url: '#', date: '2024-01-05' },
            { id: 204, name: 'Previous Marksheet', status: 'Verified', url: '#', date: '2024-01-05' }
        ]
    },
    {
        id: '3', studentId: 'ST-2024-003', name: 'Rohan Verma', class: '12-C',
        completion: 50,
        status: 'Rejected',
        documents: [
            { id: 301, name: 'Birth Certificate', status: 'Pending', url: '#', date: '2024-01-18' },
            { id: 302, name: 'Aadhar Card', status: 'Rejected', reason: 'Blurry Image', url: '#', date: '2024-01-18' }
        ]
    }
];

const COMPONENT_ROLES = {
    VERIFIER: [STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ADMIN],
    UPLOADER: [STAFF_ROLES.FRONT_DESK, STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.ADMIN]
};

const Documents = () => {
    const { user } = useStaffAuth();
    const canVerify = COMPONENT_ROLES.VERIFIER.includes(user?.role);
    const canUpload = COMPONENT_ROLES.UPLOADER.includes(user?.role);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    // Filter Logic
    const filteredList = STUDENTS_DOCS.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' ||
            (filter === 'Pending' && s.status === 'Pending Verification') ||
            s.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleBack = () => {
        setSelectedStudent(null);
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 md:pb-6 relative min-h-screen">

            {/* --- LIST VIEW --- */}
            {!selectedStudent && (
                <>
                    {/* Compact Header */}
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Documents</h1>
                                <p className="text-xs text-gray-500">Record verification</p>
                            </div>
                            {canVerify && (
                                <div className="flex gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 items-center">
                                    <AlertTriangle size={12} /> Pending: 12
                                </div>
                            )}
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 sticky top-0 md:static z-10 mx-[-4px]">
                            <div className="flex flex-col gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Find Student..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                    {['All', 'Pending', 'Verified', 'Rejected'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border transition-colors ${filter === f
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredList.map(student => (
                            <DocumentGridCard
                                key={student.id}
                                student={student}
                                onClick={() => setSelectedStudent(student)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* --- DETAIL VIEW --- */}
            {selectedStudent && (
                <DocumentVerificationView
                    student={selectedStudent}
                    onBack={handleBack}
                    canVerify={canVerify}
                    canUpload={canUpload}
                />
            )}
        </div>
    );
};

// --- SUB COMPONENTS ---

const DocumentGridCard = ({ student, onClick }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Verified': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-all cursor-pointer group relative"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate pr-2">{student.name}</h3>
                    <p className="text-[10px] text-gray-500">{student.studentId} • {student.class}</p>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border whitespace-nowrap ${getStatusStyle(student.status)}`}>
                    {student.status.split(' ')[0]}
                </div>
            </div>

            <div className="mb-2">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${student.completion === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${student.completion}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-400">
                <span>{student.documents.length} Docs</span>
                <ChevronRight size={16} />
            </div>
        </div>
    );
};

const DocumentVerificationView = ({ student, onBack, canVerify, canUpload }) => {
    const [selectedDoc, setSelectedDoc] = useState(student.documents[0] || null);

    return (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col md:static md:h-auto md:bg-transparent">
            {/* 1. Header (Compact) */}
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3 shadow-sm shrink-0">
                <button onClick={onBack} className="p-1 -ml-1 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="min-w-0">
                    <h2 className="text-sm font-bold text-gray-900 truncate">{student.name}</h2>
                    <p className="text-[10px] text-gray-500">{student.studentId}</p>
                </div>
            </div>

            {/* 2. Main Content (Split Vertical on Mobile) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* A. Document List (Scrollable Horizontal on Mobile Top, or Vertical Side on Desktop) */}
                <div className="w-full md:w-1/3 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 p-2 gap-2 whitespace-nowrap md:whitespace-normal h-20 md:h-full items-center md:items-stretch">
                    {student.documents.map(doc => (
                        <button
                            key={doc.id}
                            onClick={() => setSelectedDoc(doc)}
                            className={`flex-none md:flex-auto p-2 md:p-3 rounded-lg border text-left transition-all w-48 md:w-full flex items-center gap-2 ${selectedDoc?.id === doc.id
                                ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200'
                                : 'bg-white border-gray-100'
                                }`}
                        >
                            <FileText size={16} className={selectedDoc?.id === doc.id ? 'text-indigo-600' : 'text-gray-400'} />
                            <div className="min-w-0 overflow-hidden">
                                <p className={`text-xs font-bold truncate ${selectedDoc?.id === doc.id ? 'text-indigo-900' : 'text-gray-700'}`}>{doc.name}</p>
                                <p className="text-[10px] text-gray-400 truncate">{doc.status}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* B. Preview Area (Takes remaining space) */}
                <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
                    {selectedDoc?.url ? (
                        <img
                            src={selectedDoc.url}
                            alt="Doc"
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <div className="text-white/40 text-center text-xs">
                            <FileText size={32} className="mx-auto mb-2 opacity-50" />
                            No Preview
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Action Footer (Compact) */}
            {canVerify && selectedDoc?.status === 'Pending' && (
                <div className="bg-white border-t border-gray-200 p-3 shrink-0 flex gap-3">
                    <button className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl text-sm hover:bg-red-50">
                        Reject
                    </button>
                    <button className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-emerald-700">
                        Approve
                    </button>
                </div>
            )}
        </div>
    );
};

// Helper
const StatusBadge = ({ status }) => {
    const styles = {
        'Verified': 'bg-emerald-100 text-emerald-700',
        'Pending': 'bg-amber-100 text-amber-700',
        'Rejected': 'bg-red-100 text-red-700',
        'Missing': 'bg-gray-100 text-gray-500'
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${styles[status] || styles['Missing']}`}>
            {status}
        </span>
    );
};

export default Documents;